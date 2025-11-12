import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatOngoingCall,
  CometChatIncomingCall,
  CometChatCallEvents,
  CallWorkflow,
} from "@cometchat/chat-uikit-react";
import api from "../../../services/apiClient";

import { getAppointmentDetails } from "../../../services/appointmentService";
import { useAuth } from "../../../context/AuthContext";
import "./VideoCallPage.css";

const VideoCallPage = () => {
  const { appointmentId } = useParams();
  const { user: authUser } = useAuth();

  const [group, setGroup] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callMessage, setCallMessage] = useState(null);

  useEffect(() => {
    if (!appointmentId) return;

    let isMounted = true;
    const groupID = `cita_${appointmentId}`;

    const setupGroup = async () => {
      try {
        setError(null);
        setGroup(null);

        const { data } = await getAppointmentDetails(appointmentId);
        if (!isMounted) return;
        setAppointment(data);

        let loggedUser = await CometChat.getLoggedinUser();
        if (!loggedUser) {
          const chatTokenResponse = await api.get("/api/chat/token");
          const { authToken } = chatTokenResponse.data;
          loggedUser = await CometChat.login(authToken);
          console.log("CometChat session started for:", loggedUser.getUid());
        }

        if (
          loggedUser &&
          (!loggedUser.getName() || loggedUser.getName() === loggedUser.getUid()) &&
          authUser
        ) {
          const candidateFirstName =
            authUser.first_name ?? authUser.user?.first_name ?? authUser.profile?.first_name;
          const candidateLastName =
            authUser.last_name ?? authUser.user?.last_name ?? authUser.profile?.last_name;
          const displayName =
            [candidateFirstName, candidateLastName].filter(Boolean).join(" ") ||
            authUser.name ||
            authUser.user?.name ||
            authUser.email ||
            loggedUser.getUid();

          try {
            const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;
            if (displayName && authKey) {
              const userToUpdate = new CometChat.User(loggedUser.getUid());
              userToUpdate.setName(displayName);
              const avatarUrl =
                authUser.avatar ||
                authUser.profile_picture ||
                authUser.photo ||
                authUser.user?.avatar ||
                authUser.user?.profile_picture;
              if (avatarUrl) {
                userToUpdate.setAvatar(avatarUrl);
              }
              await CometChat.updateUser(userToUpdate, authKey);
              loggedUser.setName(displayName);
              if (avatarUrl) {
                loggedUser.setAvatar(avatarUrl);
              }
            }
          } catch (updateError) {
            console.warn("No se pudo actualizar el nombre del usuario en CometChat:", updateError);
          }
        }

        let fetchedGroup;
        try {
          fetchedGroup = await CometChat.getGroup(groupID);
          console.log("Fetched CometChat group", groupID, {
            hasJoined: fetchedGroup.getHasJoined(),
            members: fetchedGroup.getMembersCount(),
          });
        } catch (groupError) {
          if (groupError.code === "ERR_GROUP_NOT_FOUND") {
            throw new Error(
              "La sala de consulta todavía no está creada. Intenta de nuevo en unos minutos."
            );
          }
          if (groupError.code === "ERR_NOT_A_MEMBER") {
            throw new Error(
              "Aún no estás agregado al grupo privado de esta consulta. Espera a que el administrador confirme la cita."
            );
          }
          throw groupError;
        }

        if (!fetchedGroup.getHasJoined()) {
          throw new Error(
            "El grupo está en modo privado y tu usuario aún no fue añadido. Vuelve a intentarlo cuando recibas la confirmación."
          );
        }

        if (!isMounted) return;
        setGroup(fetchedGroup);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error al preparar la sala de consulta:", err);

        const fallbackMessage =
          err?.message ||
          "No se pudo cargar la sala de consulta. Intenta nuevamente.";
        setError(fallbackMessage);
      }
    };

    setupGroup();

    return () => {
      isMounted = false;
    };
  }, [appointmentId, authUser]);

  useEffect(() => {
    const subscriptions = [
      CometChatCallEvents.ccOutgoingCall.subscribe((call) => {
        const sessionId = call?.getSessionId?.() || call?.sessionId || call?.sessionID;
        setActiveSessionId(sessionId || null);
      }),
      CometChatCallEvents.ccCallAccepted.subscribe((call) => {
        const sessionId = call?.getSessionId?.() || call?.sessionId || call?.sessionID;
        setActiveSessionId(sessionId || null);
      }),
      CometChatCallEvents.ccCallRejected.subscribe(() => {
        setActiveSessionId(null);
      }),
      CometChatCallEvents.ccCallEnded.subscribe(() => {
        setActiveSessionId(null);
      }),
    ];

    return () => {
      subscriptions.forEach((subscription) => {
        try {
          subscription?.unsubscribe?.();
        } catch (unsubscribeError) {
          console.warn("No se pudo cancelar la suscripción de llamada:", unsubscribeError);
        }
      });
    };
  }, []);

  const handleStartVideoCall = useCallback(async () => {
    if (!group || isStartingCall) return;

    try {
      setCallMessage(null);
      setIsStartingCall(true);

      const call = new CometChat.Call(
        group.getGuid(),
        CometChat.CALL_TYPE.VIDEO,
        CometChat.RECEIVER_TYPE.GROUP
      );

      const initiatedCall = await CometChat.initiateCall(call);
      const sessionId =
        initiatedCall?.getSessionId?.() ||
        initiatedCall?.sessionId ||
        initiatedCall?.sessionID;

      if (sessionId) {
        setActiveSessionId(sessionId);
      }
    } catch (callError) {
      console.error("No se pudo iniciar la videollamada:", callError);
      setCallMessage(
        callError?.message ||
          "No fue posible iniciar la videollamada. Intenta nuevamente."
      );
    } finally {
      setIsStartingCall(false);
    }
  }, [group, isStartingCall]);

  const patientName = useMemo(() => {
    if (!appointment?.patient) return "Paciente sin confirmar";
    const { first_name, last_name } = appointment.patient;
    return [first_name, last_name].filter(Boolean).join(" ") || "Paciente sin confirmar";
  }, [appointment?.patient]);

  const psychologistName = useMemo(() => {
    if (!appointment?.psychologist) return "Psicólogo por asignar";
    const { first_name, last_name } = appointment.psychologist;
    return [first_name, last_name].filter(Boolean).join(" ") || "Psicólogo por asignar";
  }, [appointment?.psychologist]);

  const scheduledDate = useMemo(() => {
    const value =
      appointment?.start_time ||
      appointment?.scheduled_for ||
      appointment?.date ||
      appointment?.scheduledAt;

    if (!value) return "A coordinar";

    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "A coordinar";

      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.warn("No se pudo formatear la fecha de la cita:", err);
      return "A coordinar";
    }
  }, [appointment]);

  const sessionStatus = appointment?.status
    ? appointment.status.replace(/_/g, " ")
    : "En curso";

  const chatSubtitle = useMemo(() => {
    return `${patientName} · ${psychologistName}`;
  }, [patientName, psychologistName]);

  if (error) {
    return (
      <section className="video-call-page">
        <div className="video-call-page__error">Error: {error}</div>
      </section>
    );
  }

  if (!group) {
    return (
      <section className="video-call-page">
        <div className="video-call-page__loading">
          Cargando la sala privada de la consulta...
        </div>
      </section>
    );
  }

  return (
    <section className="video-call-page">
      <div className="video-call-page__container">
        <div className="video-call-page__header">
          <h2 className="video-call-page__title">Consulta #{appointmentId}</h2>
          <span className="video-call-page__meta">{sessionStatus}</span>
        </div>

        <div className="video-call-page__info-card">
          <div className="video-call-page__info-item">
            <span className="video-call-page__info-label">Paciente</span>
            <span className="video-call-page__info-value">{patientName}</span>
          </div>
          <div className="video-call-page__info-item">
            <span className="video-call-page__info-label">Profesional</span>
            <span className="video-call-page__info-value">{psychologistName}</span>
          </div>
          <div className="video-call-page__info-item">
            <span className="video-call-page__info-label">Programada para</span>
            <span className="video-call-page__info-value">{scheduledDate}</span>
          </div>
          <div className="video-call-page__info-item">
            <span className="video-call-page__info-label">Duración</span>
            <span className="video-call-page__info-value">
              {appointment?.duration_minutes
                ? `${appointment.duration_minutes} min`
                : "45 minutos"}
            </span>
          </div>
        </div>

        <div className="video-call-page__call-section">
          <div className="video-call-page__call-wrapper">
            {activeSessionId ? (
              <CometChatOngoingCall
                sessionID={activeSessionId}
                callWorkflow={CallWorkflow.defaultCalling}
              />
            ) : (
              <div className="video-call-page__call-placeholder">
                <div>
                  <h3>Videollamada privada</h3>
                  <p>
                    Inicia la sesión cuando ambas partes estén listas. Podrás activar cámara y
                    micrófono desde aquí.
                  </p>
                </div>
                <div className="video-call-page__call-actions">
                  <button
                    type="button"
                    onClick={handleStartVideoCall}
                    disabled={isStartingCall}
                  >
                    {isStartingCall ? "Iniciando..." : "Iniciar videollamada"}
                  </button>
                  {callMessage && (
                    <span className="video-call-page__call-message">{callMessage}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="video-call-page__chat-wrapper">
          <CometChatMessageHeader
            group={group}
            showBackButton={false}
            hideVideoCallButton
            hideVoiceCallButton
            titleView={
              <div className="video-call-page__chat-title">
                {group?.getName?.() || "Sala privada"}
              </div>
            }
            subtitleView={
              <div className="video-call-page__chat-subtitle">{chatSubtitle}</div>
            }
          />

          <div className="video-call-page__chat-body">
            <CometChatMessageList
              group={group}
              hideGroupActionMessages
              hideModerationView
              hideReactionOption={false}
            />
          </div>

          <div className="video-call-page__chat-footer">
            <CometChatMessageComposer
              group={group}
              placeholderText="Escribe tu mensaje para la consulta..."
            />
          </div>
        </div>
      </div>
      <CometChatIncomingCall onError={(callError) => console.error(callError)} />
    </section>
  );
};

export default VideoCallPage;
