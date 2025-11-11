import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogArticleForm from '../components/ArticleForm.jsx';

describe('BlogArticleForm', () => {
  it('muestra los campos del formulario correctamente', () => {
    const mockSubmit = vi.fn();
    render(<BlogArticleForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Autor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contenido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
  });

  it('permite escribir en los campos', () => {
    const mockSubmit = vi.fn();
    render(<BlogArticleForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/Título/i);
    fireEvent.change(titleInput, { target: { value: 'Nuevo título' } });
    expect(titleInput.value).toBe('Nuevo título');

    const authorInput = screen.getByLabelText(/Autor/i);
    fireEvent.change(authorInput, { target: { value: 'Juan Pérez' } });
    expect(authorInput.value).toBe('Juan Pérez');

    const contentInput = screen.getByLabelText(/Contenido/i);
    fireEvent.change(contentInput, { target: { value: 'Contenido del artículo' } });
    expect(contentInput.value).toBe('Contenido del artículo');
  });
});
