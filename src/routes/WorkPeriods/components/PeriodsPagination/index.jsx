/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "components/Pagination";
import { getWorkPeriodsPagination } from "store/selectors/workPeriods";
import {
  setWorkPeriodsPageNumber,
  setWorkPeriodsPageSize,
} from "store/actions/workPeriods";
import { loadWorkPeriodsPage } from "store/thunks/workPeriods";
import { useUpdateEffect } from "utils/hooks";
import styles from "./styles.module.scss";

/**
 * Displays challenges' pagination and a menu to choose page size.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name added to root element
 * @param {string} props.id unique pagination id
 * @returns {JSX.Element}
 */
const PeriodsPagination = ({ className, id }) => {
  const pagination = useSelector(getWorkPeriodsPagination);
  const dispatch = useDispatch();

  const onPageNumberClick = useCallback((pageNumber) => {
    dispatch(setWorkPeriodsPageNumber(+pageNumber));
  }, []);

  const onPageSizeChange = useCallback((pageSize) => {
    dispatch(setWorkPeriodsPageSize(+pageSize));
  }, []);

  const loadWorkPeriodsFirstPage = useCallback(() => {
    dispatch(loadWorkPeriodsPage(1));
  }, []);

  const loadWorkPeriodsNewPage = useCallback(() => {
    dispatch(loadWorkPeriodsPage());
  }, []);

  // Load challenges' first page if page size changes.
  useUpdateEffect(loadWorkPeriodsFirstPage, [pagination.pageSize]);

  // Load challenges' new page if page number changes.
  useUpdateEffect(loadWorkPeriodsNewPage, [pagination.pageNumber]);

  return (
    <Pagination
      id={id}
      className={cn(styles.pagination, className)}
      pageSizeClassName={styles.pageSize}
      pagination={pagination}
      onPageNumberClick={onPageNumberClick}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
    />
  );
};

export default PeriodsPagination;

const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];
