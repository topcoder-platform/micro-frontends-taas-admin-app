import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PT from "prop-types";
import IntegerFieldHinted from "components/IntegerFieldHinted";
import Modal from "components/Modal";
import Spinner from "components/Spinner";
import TextField from "components/TextField";
import { updateWorkPeriodPayment } from "store/thunks/workPeriods";
import { currencyFormatter } from "utils/formatters";
import { preventDefault } from "utils/misc";
import { CHALLENGE_PAYMENT_ACTIVE_STATUSES } from "constants/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays a modal that allows to edit specific payment using member's weekly
 * payment rate and the number of days.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const PaymentModalEdit = ({ daysPaid, daysWorked, payment, removeModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [days, setDays] = useState(payment.days);
  const dispatch = useDispatch();

  const isChanged = days !== payment.days;
  const { id: paymentId, workPeriodId: periodId } = payment;

  const maxDays =
    daysWorked -
    daysPaid +
    (payment.status in CHALLENGE_PAYMENT_ACTIVE_STATUSES ? payment.days : 0);

  const weeklyRate = payment.memberRate;
  const dailyRate = weeklyRate / 5;

  const amount = ((days * weeklyRate) / 5).toFixed(2);

  const onApprove = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const onDismiss = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onChangeDays = useCallback((days) => {
    setDays(days);
  }, []);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }
    (async function () {
      let ok = await dispatch(
        updateWorkPeriodPayment(periodId, paymentId, { amount, days })
      );
      setIsModalOpen(!ok);
      setIsProcessing(false);
    })();
  }, [amount, days, isProcessing, paymentId, periodId, dispatch]);

  return (
    <Modal
      approveColor="primary"
      approveDisabled={!isChanged || isProcessing}
      approveText="Update"
      title="Edit Payment"
      controls={isProcessing ? null : undefined}
      isDisabled={isProcessing}
      isOpen={isModalOpen}
      onApprove={onApprove}
      onClose={removeModal}
      onDismiss={onDismiss}
    >
      {isProcessing ? (
        <Spinner />
      ) : (
        <form className={styles.form} action="#" onSubmit={preventDefault}>
          <table>
            <tbody>
              <tr>
                <th>Member Rate:</th>
                <td>
                  <div className={styles.rates}>
                    {currencyFormatter.format(weeklyRate)} per week /{" "}
                    {currencyFormatter.format(dailyRate)} per day
                  </div>
                </td>
              </tr>
              <tr>
                <th>Amount:</th>
                <td>
                  <TextField
                    isDisabled={true}
                    name={`payment_amount_${payment.id}`}
                    size="small"
                    value={amount}
                  />
                </td>
              </tr>
              <tr>
                <th>Days:</th>
                <td>
                  <IntegerFieldHinted
                    name="day_cnt"
                    onChange={onChangeDays}
                    maxValue={maxDays}
                    minValue={1}
                    maxValueMessage="Cannot pay for more days than the user has worked for"
                    minValueMessage="The payment cannot be done for less than 1 day"
                    value={days}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.notice}>
            Notice: please, update payment amount in PACTS too.
          </div>
        </form>
      )}
    </Modal>
  );
};

PaymentModalEdit.propTypes = {
  daysPaid: PT.number.isRequired,
  daysWorked: PT.number.isRequired,
  payment: PT.shape({
    amount: PT.number.isRequired,
    days: PT.number.isRequired,
    id: PT.string.isRequired,
    memberRate: PT.number.isRequired,
    status: PT.string.isRequired,
    workPeriodId: PT.string.isRequired,
  }),
  removeModal: PT.func.isRequired,
};

export default PaymentModalEdit;
