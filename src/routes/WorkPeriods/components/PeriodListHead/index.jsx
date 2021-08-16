import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "components/Tooltip";
import cn from "classnames";
import moment from "moment";
import Checkbox from "components/Checkbox";
import SortingControl from "components/SortingControl";
import {
  SORT_BY,
  REASON_DISABLED,
  REASON_DISABLED_MESSAGE_MAP,
} from "constants/workPeriods";
import {
  getWorkPeriodsDateRange,
  getWorkPeriodsIsSelectedVisible,
  getWorkPeriodsSorting,
} from "store/selectors/workPeriods";
import {
  setWorkPeriodsSorting,
  toggleWorkingPeriodsVisible,
} from "store/actions/workPeriods";
import { updateQueryFromState } from "store/thunks/workPeriods";
import styles from "./styles.module.scss";

/**
 * Displays working period list column heads with sorting controls to be used
 * in PeriodList component.
 *
 * @returns {JSX.Element}
 */
const PeriodListHead = () => {
  const sorting = useSelector(getWorkPeriodsSorting);
  const isSelectedVisible = useSelector(getWorkPeriodsIsSelectedVisible);
  const periodsDateRange = useSelector(getWorkPeriodsDateRange);
  const dispatch = useDispatch();
  const { criteria, order } = sorting;

  const onSortingChange = useCallback(
    (sorting) => {
      dispatch(setWorkPeriodsSorting(sorting));
      dispatch(updateQueryFromState());
    },
    [dispatch]
  );

  const onToggleVisible = useCallback(() => {
    dispatch(toggleWorkingPeriodsVisible());
  }, [dispatch]);

  const reasonsDisabled = useMemo(() => {
    if (periodsDateRange[0].isAfter(moment())) {
      return REASON_DISABLED.NOT_ALLOW_FUTURE_WEEK;
    }
    return null;
  }, [periodsDateRange]);

  const reasonsDisabledElement = useMemo(
    () => (
      <div className={styles.tooltipContent}>
        {reasonsDisabled && REASON_DISABLED_MESSAGE_MAP[reasonsDisabled]}
      </div>
    ),
    [reasonsDisabled]
  );

  return (
    <tr className={styles.container}>
      <th>
        <div className={styles.colHead}>
          <Tooltip
            content={reasonsDisabledElement}
            isDisabled={!reasonsDisabled}
            strategy="fixed"
            targetClassName={styles.checkboxContainer}
          >
            <Checkbox
              size="small"
              isDisabled={!!reasonsDisabled}
              name={"visible_periods_selected"}
              onChange={onToggleVisible}
              checked={isSelectedVisible}
            />
          </Tooltip>
        </div>
      </th>
      {HEAD_CELLS.map(({ id, className, label, disableSort }) => (
        <th key={id}>
          <div className={cn(styles.colHead, styles[className])}>
            <span className={styles.colLabel}>{label}</span>
            {!disableSort && (
              <SortingControl
                className={styles.sortControl}
                onChange={onSortingChange}
                sortBy={id}
                value={criteria === id ? order : null}
              />
            )}
          </div>
        </th>
      ))}
    </tr>
  );
};

const HEAD_CELLS = [
  { label: "Topcoder Handle", id: SORT_BY.USER_HANDLE },
  { label: "Team Name", id: SORT_BY.TEAM_NAME, disableSort: true },
  { label: "Start Date", id: SORT_BY.START_DATE, className: "startDate" },
  { label: "End Date", id: SORT_BY.END_DATE, className: "endDate" },
  { label: "Alert", id: SORT_BY.ALERT, disableSort: true, className: "alert" },
  { label: "Weekly Rate", id: SORT_BY.WEEKLY_RATE, className: "weeklyRate" },
  { label: "Total Paid", id: SORT_BY.PAYMENT_TOTAL, className: "totalPaid" },
  { label: "Status", id: SORT_BY.PAYMENT_STATUS },
  { label: "Working Days", id: SORT_BY.WORKING_DAYS },
  { label: "", id: "ACTIONS_MENU", disableSort: true },
];

export default PeriodListHead;
