# How to Change Account Size on Solana

Accounts are a key part of developing on Solana. For the longest time accounts were static in size and the only way to change their size was to create a new account. Your entire dApp architecture chained down by the fact that you cannot change your account size.

Now you can dynamically change the size of your accounts.

## Realloc

The Realloc feature was enabled since slot 133920008, or May 15th, 2022. 

[`realloc`](https://docs.rs/solana-sdk/latest/solana_sdk/account_info/struct.AccountInfo.html#method.realloc) is a new method on the `AccountInfo` struct that allows you to set a new size for an account. 

The `realloc` method:

```rust
pub fn realloc(
    &self,
    new_len: usize,
    zero_init: bool
) -> Result<(), ProgramError>
```

- `new_len` is defined as the new size in bytes
- `zero_init` is used to zero out new bytes if the account is resized smaller then larger again in the same instruction.

**Limitations**:

- Realloc can only be used on Program owned accounts
- Max increase in bytes per call is 10KB

## How to use Realloc

When you change the size of an account you must also make sure the account is still rent-exempt. Before the change, you can calculate the new rent requirements and fund the account.

```rust
let new_size = pda_account.data.borrow().len() + 32;
let rent = Rent::get()?;
let new_minimum_balance = rent.minimum_balance(new_size);

let lamports_diff = new_minimum_balance.saturating_sub(pda_account.lamports());
invoke(
    &system_instruction::transfer(funding_account.key, pda_account.key, lamports_diff),
    &[
        funding_account.clone(),
        pda_account.clone(),
        system_program.clone(),
    ],
)?;
```

Once you guarantee that the account achieves the rent-exempt status with the new account size, you can realloc the account.

```rust
pda_account.realloc(new_size, false)?;
```

That's it!

## Running this example

To run this example, you need to run the following commands:

```bash
# In /program
$ cargo build-bpf
$ solana program deploy <PROGRAM OUTPUT>.so

# In /js
$ yarn && yarn run test
```

## Use Cases

Dynamically changing the size of an account opens up the door to a ton of new use cases.

You can:

- Dynamically increase the size of a list
- Migrate accounts on program upgrade
- Allow users to pay their way for space

and much more!