import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Property, Required } from "@tsed/schema";
import { Statements } from "../../database/entities/IncomeExpenditureStatement";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId: string;

  @Column({ unique: true })
  @Required()
  @Property()
  email: string;

  @OneToMany(() => Statements, (statement) => statement.user)
  @Property(() => [Statements])
  statements: Statements[];
}
