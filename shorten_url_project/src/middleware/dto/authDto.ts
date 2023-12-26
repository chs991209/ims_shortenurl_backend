import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, Length } from 'class-validator';

export class AuthSignupDTO {
  @IsString()
  @ApiProperty({ description: '닉네임', default: 'exampleUser' })
  nickname: string;

  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'email format is incorrect',
  })
  @ApiProperty({ description: '이메일', default: 'test@example.com' })
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
  @ApiProperty({ description: '비밀번호', default: 'P@ssw0rd123' })
  password: string;
}

export class AuthLoginDTO {
  @IsEmail()
  @ApiProperty({ description: '이메일', default: 'test@example.com' })
  email: string;

  @IsString()
  @Length(10, 20)
  @ApiProperty({ description: '비밀번호', default: 'P@ssw0rd123' })
  password: string;
}

export class AuthUpdateDTO {
  @IsString()
  @ApiProperty({
    description: '닉네임',
    default: 'updatedUser',
    required: false,
  })
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
  @ApiProperty({
    description: '비밀번호',
    default: 'NewP@ssw0rd123',
    required: false,
  })
  password?: string;
}
