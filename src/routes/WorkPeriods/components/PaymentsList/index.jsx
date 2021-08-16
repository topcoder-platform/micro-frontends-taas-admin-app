import React from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";
import PaymentsListItem from "../PaymentsListItem";

/**
 * Displays popup with payments.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentsList = ({ className, daysPaid, daysWorked, payments }) => (
  <form className={cn(styles.container, className)} action="#">
    <table className={styles.paymentsList}>
      <thead>
        <tr>
          <th>Challenge ID</th>
          <th>Weekly Rate</th>
          <th>Days</th>
          <th>Amount</th>
          <th className={styles.createdAt}>Created At</th>
          <th className={styles.paymentStatus}>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment) => (
          <PaymentsListItem
            key={payment.id}
            daysPaid={daysPaid}
            daysWorked={daysWorked}
            item={payment}
          />
        ))}
      </tbody>
    </table>
  </form>
);

PaymentsList.propTypes = {
  className: PT.string,
  daysPaid: PT.number.isRequired,
  daysWorked: PT.number.isRequired,
  payments: PT.arrayOf(
    PT.shape({
      id: PT.string.isRequired,
    })
  ),
};

export default PaymentsList;
