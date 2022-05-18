use num_derive::FromPrimitive;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

/// Errors that may be returned by the program.
#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum AccountTestError {

  #[error("Incorrect authority provided on update or delete")]
  IncorrectAuthority,

}
impl From<AccountTestError> for ProgramError {
    fn from(e: AccountTestError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for AccountTestError {
    fn type_of() -> &'static str {
        "AccountTest Error"
    }
}