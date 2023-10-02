// @ts-nocheck
'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/navigation'
import { useTable, usePagination } from 'react-table'
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

/* Insert extra imports for table cells here */

const baseAPIURL = `${pluginsAPIURL}admin/blog/`

export const getStaticProps: GetStaticProps = async () => {
  return { props: { isAdminRoute: true } }
}

const categoriesColumns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Slug',
    accessor: 'slug',
  },
  {
    Header: 'Logo',
    accessor: 'logo_url',
    Cell: data => <IMImagesTableCell singleImageURL={data.value} />,
  },
  {
    Header: 'Published',
    accessor: 'published',
    Cell: data => <IMToggleSwitchComponent isChecked={data.value} disabled />,
  },
  {
    Header: 'Parent Category',
    accessor: 'parent_id',
    Cell: data => (
      <IMForeignKeyTableCell
        id={data.value}
        apiRouteName="admin/blog/article_categories/view"
        titleKey="name"
      />
    ),
  },
  ,
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
      const path = baseAPIURL + 'article_categories/delete'
      const response = await authPost(path, { id: item.id })
      window.location.reload(false)
    }
  }

  return (
    <div className="inline-actions-container">
      <button
        onClick={() => handleView(data.row.original)}
        type="button"
        id="tooltip264453216"
        className="btn-icon btn btn-info btn-sm">
        <i className="fa fa-eye"></i>
      </button>
      <button
        onClick={() => handleEdit(data.row.original)}
        type="button"
        id="tooltip366246651"
        className="btn-icon btn btn-success btn-sm">
        <i className="fa fa-edit"></i>
      </button>
      <button
        onClick={() => handleDelete(data.row.original)}
        type="button"
        id="tooltip476609793"
        className="btn-icon btn btn-danger btn-sm">
        <i className="fa fa-times"></i>
      </button>
    </div>
  )
}

function ArticleTagCategoriesListView(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [controlledPageCount, setControlledPageCount] = useState(0)
  const [categories, setArticleTagCategories] = useState([])
  const [data, setData] = useState([])

  const [user, token, loading] = useCurrentUser()

  const columns = useMemo(() => categoriesColumns, [])

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: categories,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
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
        'article_categories/list' +
        (extraQueryParams ? extraQueryParams : ''),
      config,
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const categories = data
        setData(categories)

        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  useEffect(() => {
    const startRow = pageSize * pageIndex
    const endRow = startRow + pageSize

    setArticleTagCategories(data.slice(startRow, endRow))
    setControlledPageCount(Math.ceil(data.length / pageSize))
  }, [pageIndex, pageSize, data])

  return (
    <>
      <div className="content">
        <div className="row">
          <div className="col col-md-12">
            <div className="Card">
              <div className="CardHeader">
                <a className="Link AddLink" href="./add">
                  Add New
                </a>
                <h4>Article Tag Categories</h4>
              </div>
              <div className="CardBody">
                <div className="TableContainer">
                  <table className="Table" {...getTableProps()}>
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
                          <td colSpan={categoriesColumns.length - 1}>
                            <p>Loading...</p>
                          </td>
                        ) : (
                          <td colSpan={categoriesColumns.length - 1}>
                            <p className="PaginationDetails">
                              Showing {page.length} of {data.length} results
                            </p>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  <div className="Pagination">
                    <div className="LeftPaginationButtons">
                      <button
                        onClick={() => gotoPage(0)}
                        className="PaginationButton"
                        disabled={!canPreviousPage}>
                        <i className="fa fa-angle-double-left"></i>
                      </button>{' '}
                      <button
                        onClick={() => previousPage()}
                        className="PaginationButton"
                        disabled={!canPreviousPage}>
                        <i className="fa fa-angle-left"></i>
                      </button>
                    </div>
                    <div className="CenterPaginationButtons">
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
                    <div className="RightPaginationButtons">
                      <button
                        onClick={() => nextPage()}
                        className="PaginationButton"
                        disabled={!canNextPage}>
                        <i className="fa fa-angle-right"></i>
                      </button>{' '}
                      <button
                        onClick={() => gotoPage(pageCount - 1)}
                        className="PaginationButton"
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

export default ArticleTagCategoriesListView
