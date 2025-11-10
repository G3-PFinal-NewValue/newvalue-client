import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { CometChatConversationsWithMessages } from '@cometchat/chat-uikit-react';


import { getAppointmentDetails } from '../../../services/appointmentService'; 

const VideoCallPage = () => {
  const { appointmentId } = useParams();
  
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // El ID del grupo será único para esta cita
    const groupID = `cita_${appointmentId}`;
    
    // Función para crear o unirse al grupo
    const setupGroup = async () => {
      try {

        const { data: appointment } = await getAppointmentDetails(appointmentId);
        
      
        const patientUID = appointment.patientId.toString();
        const psychologistUID = appointment.psychologistId.toString();

     
        let currentGroup;
        try {
          currentGroup = await CometChat.getGroup(groupID);
          console.log('Grupo existente encontrado:', currentGroup);
        } catch (e) {
          // Si no existe, lo creamos
          if (e.code === 'ERR_GROUP_NOT_FOUND') {
            console.log('Creando grupo:', groupID);
            const group = new CometChat.Group(
              groupID,
              `Consulta ${appointmentId}`, // Nombre del grupo
              CometChat.GROUP_TYPE.PRIVATE
            );
            
            // Definir miembros
            const members = [
              new CometChat.GroupMember(patientUID, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT),
              new CometChat.GroupMember(psychologistUID, CometChat.GROUP_MEMBER_SCOPE.ADMIN),
            ];
            
            // Crea el grupo y añade los miembros
            currentGroup = await CometChat.createGroupWithMembers(group, members, []);
            console.log('Grupo y miembros creados:', currentGroup);
          } else {
            throw e; // Otro error
          }
        }
        setGroup(currentGroup);

      } catch (err) {
        console.error('Error al configurar el grupo de CometChat:', err);
        setError('No se pudo cargar la sala de consulta.');
      }
    };

    setupGroup();

  }, [appointmentId]);

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!group) {
    return <div style={{ padding: '20px' }}>Cargando sala de consulta...</div>;
  }

  // Renderiza la UI completa de CometChat (chat + botón de video)
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 80px)' /* Ajusta la altura como necesites */ }}>
      
      
      <CometChatConversationsWithMessages group={group} />
      
    </div>
  );
};

export default VideoCallPage;