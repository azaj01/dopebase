// @ts-nocheck
'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/navigation'
import { useGlobalFilter, useTable, usePagination } from 'react-table'
import {
  IMLocationTableCell,
  IMSimpleLocationTableCell,
  IMColorsTableCell,
  IMMultimediaTableCell,
  IMObjectTableCell,
  IMImagesTableCell,
  IMDateTableCell,
  IMForeignKeyTableCell,
  IMAddressTableCell,
} from '../../../../../admin/components/forms/table'
import {
  IMColorBoxComponent,
  IMPhoto,
  IMModal,
  IMToggleSwitchComponent,
} from '../../../../../admin/components/forms/fields'
import { pluginsAPIURL } from '../../../../../config/config'
import useCurrentUser from '../../../../../modules/auth/hooks/useCurrentUser'
import { authPost } from '../../../../../modules/auth/utils/authFetch'
import styles from '../../../../../admin/themes/admin.module.css'
/* Insert extra imports for table cells here */
import TaxiTripPassengerObjectTableCell from '../../components/tableCells/TaxiTripPassengerObjectTableCell.js'


const baseAPIURL = `${pluginsAPIURL}admin/taxi/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const TripsColumns = [
  
      {
          Header: "ID",
          accessor: "id",
      },
          {
          Header: "Pickup Location",
          accessor: "pickup",
          Cell: data => (
              <IMLocationTableCell data={data.value} />
          )
          },
          {
          Header: "Dropoff Location",
          accessor: "dropoff",
          Cell: data => (
              <IMLocationTableCell data={data.value} />
          )
          },
      {
          Header: "Status",
          accessor: "status",
      },
      {
          Header: "Passenger",
          accessor: "passenger",
          Cell: data => (
              <TaxiTripPassengerObjectTableCell data={data.value} />
          )
      },
      {
          Header: "Passenger ID",
          accessor: "passengerID",
          Cell: data => (
              <IMForeignKeyTableCell id={data.value} apiRouteName="admin/taxi/users" viewRoute="users"
          titleKey="title" />
          )
      },
      {
          Header: "Car Type",
          accessor: "carType",
      },
      {
          Header: "Price Range",
          accessor: "priceRange",
      },
      {
          Header: "Ride",
          accessor: "ride",
          Cell: data => (
              <IMObjectTableCell data={data.value} />
          )
      },
          {
          Header: "Current Location",
          accessor: "carDrive",
          Cell: data => (
              <IMLocationTableCell data={data.value} />
          )
          },
      {
          Header: "Created At",
          accessor: "createdAt",
          Cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },
      {
          Header: "Updated At",
          accessor: "updatedAt",
          Cell: data => (
              <IMDateTableCell timestamp={data.value} />
          )
      },,
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: data => <ActionsItemView data={data} />,
  },
]

function ActionsItemView(props) {
  const { data } = props
  const router = useRouter()

  const handleView = item => {
    const viewPath = './view?id=' + item.id
    router.push(viewPath)
  }

  const handleEdit = item => {
    const editPath = './update?id=' + item.id
    router.push(editPath)
  }

  const handleDelete = async item => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const path = baseAPIURL + 'taxi_trips/delete'
      const response = await authPost(path, { id: item.id })
      window.location.reload(false)
    }
  }

  return (
    <div className={`${styles.inlineActionsContainer} inlineActionsContainer`}>
      <button
        onClick={() => handleView(data.row.original)}
        type="button"
        id="tooltip264453216"
        className={`${styles.btnSm} btn-icon btn btn-info btn-sm`}>
        <i className="fa fa-eye"></i>
      </button>
      <button
        onClick={() => handleEdit(data.row.original)}
        type="button"
        id="tooltip366246651"
        className={`${styles.btnSm} btn-icon btn btn-success btn-sm`}>
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(data.row.original)}
        type="button"
        id="tooltip476609793"
        className={`${styles.btnSm} btn-icon btn btn-danger btn-sm`}>
        <i className="fa fa-times"></i>
      </button>
    </div>
  )
}

function TripsListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [controlledPageCount, setControlledPageCount] = useState(0)
  const [Trips, setTrips] = useState([])
  const [data, setData] = useState([])

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => TripsColumns, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    //pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: Trips,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useGlobalFilter,
    usePagination,
  )

  useEffect(() => {
    if (loading) {
      return
    }
    const config = {
      headers: { Authorization: token },
    }

    const extraQueryParams = null
    setIsLoading(true)

    fetch(
      baseAPIURL +
        'taxi_trips/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const taxi_trips = data
        setData(taxi_trips)

        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    const startRow = pageSize * pageIndex
    const endRow = startRow + pageSize

    setTrips(data.slice(startRow, endRow))
    setControlledPageCount(Math.ceil(data.length / pageSize))
  }, [pageIndex, pageSize, data])

  return (
    <>
      <div className={`${styles.adminContent} adminContent`}>
        <div className="row">
          <div className="col col-md-12">
            <div className="Card">
              <div className="CardHeader">
                <a
                  className={`${styles.Link} ${styles.AddLink} Link AddLink`}
                  href="./add">
                  Add New
                </a>
                <h1>Rides</h1>
              </div>
              <div className={`${styles.CardBody} CardBody`}>
                <div className={`${styles.TableContainer} TableContainer`}>
                  <input
                    className={`${styles.SearchInput} SearchInput`}
                    type="text"
                    placeholder="Search..."
                    value={globalFilter || ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                  />
                  <table
                    className={`${styles.Table} Table`}
                    {...getTableProps()}>
                    <thead>
                      {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                              {column.render('Header')}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row, i) => {
                        prepareRow(row)
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render('Cell')}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                      <tr>
                        {isLoading ? (
                          <td colSpan={TripsColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={TripsColumns.length - 1}>
                            <p
                              className={`${styles.PaginationDetails} PaginationDetails`}>
                              Showing {page.length} of {data.length} results
                            </p>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  <div className={`${styles.Pagination} Pagination`}>
                    <div
                      className={`${styles.LeftPaginationButtons} LeftPaginationButtons`}>
                      <button
                        onClick={() => gotoPage(0)}
                        className={`${styles.PaginationButton}`}
                        disabled={!canPreviousPage}>
                        <i className="fa fa-angle-double-left"></i>
                      </button>{' '}
                      <button
                        onClick={() => previousPage()}
                        className={`${styles.PaginationButton}`}
                        disabled={!canPreviousPage}>
                        <i className="fa fa-angle-left"></i>
                      </button>
                    </div>
                    <div className={`${styles.CenterPaginationButtons}`}>
                      <span>
                        Page{' '}
                        <strong>
                          {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                      </span>
                      <span>
                        | Go to page:{' '}
                        <input
                          type="number"
                          defaultValue={pageIndex + 1}
                          onChange={e => {
                            const page = e.target.value
                              ? Number(e.target.value) - 1
                              : 0
                            gotoPage(page)
                          }}
                          style={{ width: '100px' }}
                        />
                      </span>{' '}
                      <select
                        value={pageSize}
                        onChange={e => {
                          setPageSize(Number(e.target.value))
                        }}>
                        {[10, 20, 30, 40, 50].map(pageSize => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={`${styles.RightPaginationButtons}`}>
                      <button
                        onClick={() => nextPage()}
                        className={`${styles.PaginationButton}`}
                        disabled={!canNextPage}>
                        <i className="fa fa-angle-right"></i>
                      </button>{' '}
                      <button
                        onClick={() => gotoPage(pageCount - 1)}
                        className={`${styles.PaginationButton}`}
                        disabled={!canNextPage}>
                        <i className="fa fa-angle-double-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TripsListView
