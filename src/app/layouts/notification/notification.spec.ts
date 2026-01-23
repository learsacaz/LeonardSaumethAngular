import { Notification } from './notification';

describe('Notification Component', () => {
  let component: Notification;

  beforeEach(() => {
    component = new Notification();
  });

  it('debería tener valores por defecto en los inputs', () => {
    expect(component.message).toBe('This is a notification message');
    expect(component.status).toBe('success');
  });

  it('debería permitir sobrescribir el mensaje', () => {
    component.message = 'Nuevo mensaje';
    expect(component.message).toBe('Nuevo mensaje');
  });

  it('debería permitir sobrescribir el status', () => {
    component.status = 'error';
    expect(component.status).toBe('error');
  });
});
