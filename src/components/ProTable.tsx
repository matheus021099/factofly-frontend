import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import React, { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { TablePagination } from '@mui/material'
import { ArrowUpwardOutlined } from '@mui/icons-material'

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'transparent',
    color: '#6c757d',
    fontWeight: 'bold',
    boxShadow: 'inset 0 0 0 9999px transparent',
  },
  [`&.${tableCellClasses.body}`]: {
    color: '#6c757d',
    fontSize: '0.9rem',
    fontWeight: 400,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: 'rgba(222,226,230,.4)',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: 'transparent',
  },
}))

interface IItem {
  key: string
  name: String
}

interface IFilterItem {
  key: string
  name: string
  items: IItem[]
}

interface ISorterFilters {
  sortBy: IItem[]
  filters?: IFilterItem[]
}

export interface RecordType {
  [key: string]: any
}

export interface ColumnType {
  key: string
  name: String
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  render?: (value: any, record: RecordType, index: number) => React.ReactNode
}

interface IProTable extends ISorterFilters {
  columns: ColumnType[]
  data: RecordType[]
}

interface IFilterOptions {
  [key: string]: string
}

const ProTable: React.FC<IProTable> = ({ columns, data, sortBy, filters }) => {
  const [showFilterList, setShowFilterList] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState<IFilterOptions>({})
  const [rowsPerPage, setRowsPerPage] = useState<number>(100)
  const [filteredData, setFilteredData] = useState<RecordType[]>([])
  const [page, setPage] = useState<number>(0)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<boolean>(false)

  const onFilterClick = () => {
    setShowFilterList((prev) => !prev)
  }

  useEffect(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage

    const filteredItems = data
      .filter((item) => {
        return Object.keys(filterOptions).every((key) => {
          return item.hasOwnProperty(key) && item[key] === filterOptions[key]
        })
      })
      .slice(startIndex, endIndex)

    const sortedItems = sortField
      ? filteredItems.sort((a, b) => {
          if (a[sortField] < b[sortField]) return sortDirection ? -1 : 1
          if (a[sortField] > b[sortField]) return sortDirection ? 1 : -1
          return 0
        })
      : filteredItems

    setFilteredData(sortedItems)
  }, [filterOptions, page, rowsPerPage, sortField, sortDirection])

  const handleFilterOptions = (key: string, value: string) => {
    setFilterOptions((prev) => ({ ...prev, [key]: value }))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  return (
    <Box sx={{ paddingTop: '20px' }}>
      <Box
        sx={{
          borderRadius: '0.2rem',
          background: 'linear-gradient(135deg, #0142c2, #0142c2 40%)',
          padding: '12px',
        }}
      >
        <Paper
          component="form"
          sx={{
            padding: 0,
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '40px',
          }}
        >
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} />
          <IconButton
            color="primary"
            sx={{
              borderLeft: showFilterList
                ? 0
                : '1px solid rgb(221, 221, 221) !important',
              color: showFilterList ? 'white' : 'black',
              fontSize: '16px',
              borderRadius: '0px !important',
              backgroundColor: showFilterList ? 'rgb(49, 58, 70)' : '#eef2f7',
            }}
            onClick={onFilterClick}
          >
            <span>Filters</span>
            <FilterAltOutlinedIcon />
          </IconButton>
        </Paper>
        {showFilterList && (
          <Box
            sx={{
              backgroundColor: 'rgb(49, 58, 70)',
              padding: '0.75rem',
            }}
          >
            <Box sx={{ color: 'rgb(255, 255, 255)' }}>
              <Grid container spacing={2} alignItems="end">
                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column">
                    <span>Sort By</span>
                    <Box display="flex" sx={{ width: '100%' }}>
                      <FormControl
                        fullWidth
                        sx={{ backgroundColor: 'white', flexGrow: 1 }}
                      >
                        <Select
                          size="small"
                          value={sortField}
                          onChange={(e) => setSortField(e.target.value)}
                        >
                          {sortBy.map(({ key, name }) => (
                            <MenuItem value={key} key={key}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        sx={{
                          borderLeft: '1px solid rgb(221, 221, 221) !important',
                          backgroundColor: '#eef2f7',
                          borderRadius: '0px !important',
                          minWidth: '40px',
                        }}
                        onClick={() => setSortDirection((prev) => !prev)}
                      >
                        {sortDirection ? (
                          <ArrowUpwardOutlined />
                        ) : (
                          <ArrowDownwardIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>

                {filters &&
                  filters.map((filter) => (
                    <Grid item xs={12} md={4} key={filter.key}>
                      <Box display="flex" flexDirection="column">
                        <span>{filter.name}</span>
                        <Box display="flex" sx={{ width: '100%' }}>
                          <FormControl
                            fullWidth
                            sx={{ backgroundColor: 'white' }}
                          >
                            <Select
                              size="small"
                              onChange={(e) =>
                                handleFilterOptions(
                                  filter.key,
                                  e.target.value as string
                                )
                              }
                            >
                              {filter.items.map(({ key, name }) => (
                                <MenuItem value={key} key={key}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Grid>
                  ))}

                <Grid item xs={12} md={4}>
                  <Box
                    display="flex"
                    sx={{
                      width: '100%',
                      alignItems: 'center',
                      gap: '5px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span>Number of Entities</span>
                    <FormControl
                      fullWidth
                      sx={{ backgroundColor: 'white', width: '100px' }}
                    >
                      <Select
                        size="small"
                        defaultValue={100}
                        onChange={(e) =>
                          setRowsPerPage(e.target.value as number)
                        }
                      >
                        <MenuItem value="25">25</MenuItem>
                        <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid rgb(222, 226, 230)',
          borderRadius: '3px',
          clear: 'both',
          marginTop: '6px !important',
          marginBottom: '6px !important',
          maxWidth: 'none !important',
          borderCollapse: 'separate !important',
          borderSpacing: 0,
          backgroundColor: 'transparent',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({ key, name, align }) => (
                <StyledTableCell key={key} align={align || 'left'}>
                  {name}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => {
              return (
                <StyledTableRow key={`row ${index}`}>
                  {columns.map((column, rowIndex) => {
                    if (column.render)
                      return (
                        <StyledTableCell>
                          {column.render(row[column.key], row, rowIndex)}
                        </StyledTableCell>
                      )
                    else
                      return (
                        <StyledTableCell>{row[column.key]}</StyledTableCell>
                      )
                  })}
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  )
}

export default ProTable
