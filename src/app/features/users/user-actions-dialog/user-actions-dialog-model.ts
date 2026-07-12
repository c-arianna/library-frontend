export type UserAction =
  | 'suspend'
  | 'unsuspend'
  | 'unsubscribe';

export interface UserActionsDialogData {
  userId?: string;
  action: UserAction;
}