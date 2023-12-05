import { IsEmail, IsString, Matches, Length } from 'class-validator';

export class AuthSignupDTO {
  @IsString()
  nickname: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'email format is incorrect',
  })
  email: string;

  @IsString()
  @Length(10, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,20}$/,
    {
      message:
        'password between 10 and 20 and include upper and lower case letters and special characters',
    },
  )
  password: string;
}

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(10, 20)
  password: string;
}

export class AuthUpdateDTO {
  @IsString()
  nickname?: string;

  @IsString()
  @Length(10, 20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,20}$/,
    {
      message:
        'password between 10 and 20 and include upper and lower case letters and special characters',
    },
  )
  password?: string;
}
