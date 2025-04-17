import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Pagination,
  Card,
} from 'react-bootstrap';
import { Book } from '../types';
import { bookAPI } from '../utils/api';
import BookCard from '../components/BookCard';

const BooksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const genre = searchParams.get('genre') || '';
  const pageNumber = Number(searchParams.get('page')) || 1;

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(pageNumber);
  const [pages, setPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>(keyword);
  const [selectedGenre, setSelectedGenre] = useState<string>(genre);

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Thriller',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const result = await bookAPI.getBooks(page, keyword, genre);
        
        setBooks(result.data);
        setPage(result.page);
        setPages(result.pages);
        setTotal(result.total);
      } catch (err: any) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'An error occurred. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, keyword, genre]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL params and trigger fetch
    const params = new URLSearchParams();
    if (searchKeyword) params.append('keyword', searchKeyword);
    if (selectedGenre) params.append('genre', selectedGenre);
    params.append('page', '1');
    
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedGenre('');
    setSearchParams({});
  };

  return (
    <Container>
      <h1 className="mb-4">Browse Books</h1>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={5} className="mb-2 mb-md-0">
                    <Form.Control
                      type="text"
                      placeholder="Search by title, author, or description"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </Col>
                  <Col md={4} className="mb-2 mb-md-0">
                    <Form.Select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                      <option value="">All Genres</option>
                      {genres.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={3} className="d-flex">
                    <Button type="submit" variant="primary" className="flex-grow-1 me-2">
                      Search
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : books.length === 0 ? (
        <div className="text-center py-5">
          <h3>No books found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {books.map((book) => (
              <Col key={book._id}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                />
                
                {Array.from({ length: pages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(pages)}
                  disabled={page === pages}
                />
              </Pagination>
            </div>
          )}
          
          <div className="text-center mt-3">
            <p>
              Showing {books.length} of {total} books
            </p>
          </div>
        </>
      )}
    </Container>
  );
};

export default BooksPage; 