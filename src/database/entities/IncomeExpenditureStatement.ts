import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { TransactionEntry } from "./TransactionEntry";

@Entity("statements")
export class Statements {
  @PrimaryGeneratedColumn("uuid", { name: "statement_id" })
  statementId: string;

  @OneToMany(() => TransactionEntry, (transactionEntry) => transactionEntry.statement, { cascade: true })
  transactionEntries: TransactionEntry[];

  @Column("float", { name: "total_income" })
  totalIncome: number;

  @Column("float", { name: "total_expenditure" })
  totalExpenditure: number;

  @Column("float", { name: "disposable_income" })
  disposableIncome: number;

  @Column()
  rating: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
