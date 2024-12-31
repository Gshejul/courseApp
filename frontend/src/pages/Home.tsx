import {useState, useEffect} from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Pagination,
  } from '@mui/material'
  import CourseCard from '../components/CourseCard'
  import { courses as coursesApi } from '../services/api'
  
  const ITEMS_PER_PAGE = 12
  
  const Home = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [category, setCategory] = useState('all')
    const [level, setLevel] = useState('all')
    const [page, setPage] = useState(1)
  
    useEffect(() => {
      fetchCourses()
    }, [])
  
    const fetchCourses = async () => {
      try {
        const response = await coursesApi.getAll()
        setCourses(response.data)
      } catch (err: any) {
        setError('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }
  
    const filteredCourses = courses.filter((course: any) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCategory = category === 'all' || course.category === category
      const matchesLevel = level === 'all' || course.level === level
  
      return matchesSearch && matchesCategory && matchesLevel
    })
  
    const paginatedCourses = filteredCourses.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    )
  
    const pageCount = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Explore Courses
        </Typography>
  
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  label="Level"
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
  
        {loading ? (
          <Typography>Loading courses...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid container spacing={4}>
              {paginatedCourses.map((course: any) => (
                <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
  
            {pageCount > 1 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
  
            {filteredCourses.length === 0 && (
              <Typography align="center" sx={{ mt: 4 }}>
                No courses found matching your criteria.
              </Typography>
            )}
          </>
        )}
      </Container>
    )
  }
  
  export default Home
  
