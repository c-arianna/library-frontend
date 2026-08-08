export function mapError(code?: string): string {

  switch (code) {

    case 'VALIDATION_ERROR':
      return 'I dati inseriti non sono validi';

    case 'USER_ALREADY_EXISTS':
      return 'Email già registrata';

    case 'BOOK_ALREADY_EXISTS':
      return 'Libro già registrato';

    case 'LOAN_ALREADY_EXISTS':
      return 'Prestito già registrato';

    case 'INVALID_BOOK_COPY_QUANTITY':
      return 'Il numero di copie deve essere maggiore di 0';

    case 'INVALID_USER':
      return 'Utente non autenticato';

    case 'INVALID_USER_DATA':
      return 'I dati di registrazione non sono validi';

    case 'INVALID_PASSWORD':
      return 'Password non valida';

    case 'INVALID_EMAIL':
      return 'Email non valida';

    case 'ACCESS_DENIED':
      return 'Non hai i permessi necessari per accedere a questa risorsa';

    case 'USER_NOT_CREATED':
    case 'USER_NOT_FOUND':
      return 'Utente non trovato';

    case 'BOOK_NOT_REGISTERED':
    case 'BOOK_NOT_FOUND':
      return 'Libro non trovato';

    case 'LOAN_NOT_CREATED':
    case 'LOAN_NOT_FOUND':
      return 'Prestito non trovato';

    case 'CANNOT_REMOVE_BOOK_COPIES':
      return 'Non è possibile rimuovere copie del libro';

    case 'INVALID_STATE_TRANSITION':
      return 'Operazione non consentita nello stato attuale del prestito';

    case 'BOOK_ALREADY_REGISTERED':
      return 'Il libro richiesto è già presente nel catalogo';

    case 'BOOK_REQUEST_ALREADY_EXIST':
      return 'Richiesta già creata per questo libro, se vuoi puoi votarla';

    case 'BOOK_REQUEST_NOT_FOUND':
      return 'Richiesta non trovata';

    case 'BOOK_REQUEST_ALREADY_CLOSED':
      return 'La richiesta è chiusa, non puoi procedere con la votazione';

    case 'INVALID_REQUEST_STATE_TRANSITION':
      return 'Operazione non consentita nello stato attuale della richiesta';

    case 'USER_ALREADY_VOTED':
      return 'Hai già votato questa richiesta';

    case 'USER_REQUESTER_CANNOT_VOTE':
      return 'Hai creato la richiesta, quindi non puoi votarla'
      
    default:
      return 'Si è verificato un errore imprevisto';

  }

}