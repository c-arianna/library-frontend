export function mapError(code?: string): string {

  switch (code) {

    case 'USER_ALREADY_EXISTS':
      return 'Email già registrata';

    case 'INVALID_EMAIL':
      return 'Email non valida';

    default:
      return 'Errore imprevisto';
  }
}