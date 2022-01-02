import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNumber, MinLength, Min, IsDefined } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
