import cx from 'classnames'

export const Table = ({ className, children, ...props }) => (
  <table className={cx('govuk-table lbh-table', className)} {...props}>
    {children}
  </table>
)

export const THead = ({ className, children, ...props }) => (
  <thead className={cx('govuk-table__head', className)} {...props}>
    {children}
  </thead>
)

export const TBody = ({ className, children, ...props }) => (
  <tbody className={cx('govuk-table__body', className)} {...props}>
    {children}
  </tbody>
)

export const TRow = ({ className, children, ...props }) => (
  <tr className={cx('govuk-table__row', className)} {...props}>
    {children}
  </tr>
)

export const THeader = ({
  className,
  children,
  numeric,
  width,
  align,
  ...props
}) => (
  <th
    className={cx('govuk-table__header', className, {
      'govuk-table__cell--numeric': numeric,
      [`govuk-!-width-${width}`]: width,
      [`govuk-!-text-align-${align}`]: align,
    })}
    {...props}
  >
    {children}
  </th>
)

export const TCell = ({
  className,
  children,
  numeric,
  width,
  align,
  ...props
}) => (
  <td
    className={cx('govuk-table__cell', className, {
      'govuk-table__cell--numeric': numeric,
      [`govuk-!-width-${width}`]: width,
      [`govuk-!-text-align-${align}`]: align,
    })}
    {...props}
  >
    {children}
  </td>
)
