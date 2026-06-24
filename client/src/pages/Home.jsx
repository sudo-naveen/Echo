import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getQuestions, getTrending, getQuestionsByCompany } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
  'Netflix', 'Adobe', 'Oracle', 'Salesforce', 'IBM',
  'Intel', 'NVIDIA', 'Cisco', 'Accenture', 'TCS',
  'Infosys', 'Wipro', 'Cognizant', 'Zoho', 'Freshworks',
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [companyQuestions, setCompanyQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searching, setSearching] = useState(false);

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const company = searchParams.get('company') || '';

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setSearching(!!search);
    try {
      const { data } = await getQuestions({ search, tag, company, page, limit: 10 });
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }, [search, tag, company, page]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    getTrending({ limit: 5 })
      .then(({ data }) => setTrending(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!search && !tag && !company) {
      const fetchCompanyQuestions = async () => {
        const results = {};
        const batch = COMPANIES.slice(0, 6);
        for (const c of batch) {
          try {
            const { data } = await getQuestionsByCompany(c);
            if (data.length > 0) results[c] = data.slice(0, 3);
          } catch { /* ignore */ }
        }
        setCompanyQuestions(results);
      };
      fetchCompanyQuestions();
    }
  }, [search, tag, company]);

  const handleSearch = (value) => {
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    setSearchParams(params);
    setPage(1);
  };

  const handleTagClick = (tagName) => {
    const params = new URLSearchParams();
    params.set('tag', tagName);
    setSearchParams(params);
    setPage(1);
  };

  const handleCompanyClick = (companyName) => {
    const params = new URLSearchParams();
    params.set('company', companyName);
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = search || tag || company;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {company ? `${company} Interview Questions` : tag ? `Questions tagged: ${tag}` : search ? `Search results: "${search}"` : 'Interview Questions'}
            </h1>
            <SearchBar onSearch={handleSearch} initialValue={search} />
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-2 text-sm text-primary-600 hover:text-primary-700 transition">
                &larr; Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text={searching ? 'Searching...' : 'Loading questions...'} />
          ) : questions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500">No questions found</h3>
              <p className="text-sm text-gray-400 mt-1">
                {search ? 'Try different keywords.' : tag ? 'Try a different tag.' : 'Be the first to ask a question!'}
              </p>
              <Link to="/ask" className="inline-block mt-4 bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Ask a Question
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                          page === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {!hasActiveFilters && Object.keys(companyQuestions).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Companies</h2>
              <div className="space-y-2">
                {COMPANIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCompanyClick(c)}
                    className="block w-full text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 px-2 py-1.5 rounded transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending</h2>
            {trending.length === 0 ? (
              <p className="text-sm text-gray-400">No trending questions yet.</p>
            ) : (
              <ul className="space-y-3">
                {trending.slice(0, 5).map((q) => (
                  <li key={q.id}>
                    <Link
                      to={`/questions/${q.id}`}
                      className="text-sm text-gray-700 hover:text-primary-600 transition line-clamp-2"
                    >
                      {q.title}
                    </Link>
                    <span className="text-xs text-gray-400 block mt-0.5">{q.views} views</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {!hasActiveFilters && Object.keys(companyQuestions).length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company-wise Interview Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANIES.map((c) => {
              const qs = companyQuestions[c];
              return (
                <div key={c} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{c}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {qs ? `${qs.length}+ questions` : 'No questions'}
                    </span>
                  </div>
                  {qs ? (
                    <ul className="space-y-2">
                      {qs.map((q) => (
                        <li key={q.id}>
                          <Link
                            to={`/questions/${q.id}`}
                            className="text-sm text-gray-600 hover:text-primary-600 transition line-clamp-2"
                          >
                            {q.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">No questions yet for {c}.</p>
                  )}
                  <Link
                    to={`/?company=${encodeURIComponent(c)}`}
                    className="inline-block mt-3 text-xs font-medium text-primary-600 hover:text-primary-700 transition"
                  >
                    View all {c} questions &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
