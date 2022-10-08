
import {FormRow, FormRowSelect} from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

export default function SearchContainer() {
  const {
    isLoading, search, searchStatus,searchType, sort,
    sortOptions, statusOptions, jobTypeOptions,
    handleChange, clearFilters
  } = useAppContext()

  const handleSearch = e => {
    // if (isLoading) return    // reason of lagging
    handleChange({name: e.target.name, value: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    clearFilters()
  }

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search by position */}
          <FormRow
            type='text'
            name='search'
            value={search}
            handleChange={handleSearch}
          />

          {/* search by status */}
          <FormRowSelect
            labelText='job status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            listOfOptions={['All', ...statusOptions]}
          />

          {/* search by job type */}
          <FormRowSelect
            labelText='job type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            listOfOptions={['All', ...jobTypeOptions]}
          />

          {/* search by sort */}
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            listOfOptions={sortOptions}
          />

          <button
            className='btn btn-block btn-danger'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  )
}