export const API_URL = "http://217.219.165.15/api";

export enum OS {
  UBUNTU = 0,
  CENTOS = 1,
}
export enum RegistrationStatus {
  WAITING_FOR_EMAIL_VERIFICATION = 0,
  REGISTERED = 1,
  DEACTIVATED=2,
}
export enum UserRole {
  USER = 0,
  ADMIN = 1,
  DEVELOPER = 2,
}

export enum VMSTATES {
  NOT_STARTED_YET, //-
  RUNNING,    //shut,re
  SHUTDOWN,   //powerup
  RESTARTING, //-
  FREEZING,   //-
  END_OF_USAGE, //- wont be able to see
}
