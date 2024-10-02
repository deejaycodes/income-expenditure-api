import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Statements } from "./IncomeExpenditureStatement";
import { TransactionType } from "../../enums/TransactionEnums";

@Entity("transaction_entries")
export class TransactionEntry {
  @PrimaryGeneratedColumn("uuid", { name: "transaction_entry_id" })
  transactionId: string;

  @Column()
  description: string;

  @Column("float")
  amount: number;

  @Column("enum", { enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Statements, (statement) => statement.transactionEntries)
  @JoinColumn({ name: "statement_id" })
  statement: Statements;
}
