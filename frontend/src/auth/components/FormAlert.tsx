interface FormAlertProps {
  type: 'error' | 'success';
  message: string;
}

export function FormAlert({ type, message }: FormAlertProps) {
  return (
    <div className={`form-alert form-alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span aria-hidden="true">{type === 'error' ? '!' : '✓'}</span>
      {message}
    </div>
  );
}
