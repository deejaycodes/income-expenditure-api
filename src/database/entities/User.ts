import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Statements } from "./IncomeExpenditureStatement";
import { Property } from "@tsed/schema";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId: string;

  @Column({ length: 254 })
  email: string;

  @OneToMany(() => Statements, (statement) => statement.user)
  @Property(() => Statements)
  statements: Statements[];
}
