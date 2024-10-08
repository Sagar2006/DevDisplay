import { useState, useEffect, useRef } from 'react';
import Profile from './components/Profile/Profile';
import ProfileSkeleton from './components/ProfileSkeleton/ProfileSkeleton';
import Search from './components/Search/Search';
import Sidebar from './components/Sidebar/Sidebar';
import ErrorPage from './components/ErrorPage/ErrorPage';
import NoResultFound from './components/NoResultFound/NoResultFound';
import Pagination from './components/Pagination/Pagination';
import SkillMatcher from './components/SkillMatcher';
import './App.css';
import filenames from './ProfilesList.json';

function App() {
  console.log('Homepage component rendered');
  const profilesRef = useRef();
  const [profiles, setProfiles] = useState([]);
  const [searching, setSearching] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffledProfiles, setShuffledProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const recordsPerPage = 20;
  const [matchedProfiles, setMatchedProfiles] = useState([]);

  const currentUrl = window.location.pathname;
  useEffect(() => {
    const fetchData = async (file) => {
      try {
        const response = await fetch(file);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    };

    const combineData = async () => {
      setLoadingProfiles(true);
      try {
        const promises = filenames.map((file) => fetchData(`/data/${file}`));
        const combinedData = await Promise.all(promises);
        const flattenedData = combinedData.flat();
        setCombinedData(flattenedData);
        setShuffledProfiles(shuffleProfiles(flattenedData));
      } catch (error) {
        console.error('Error combining data:', error);
        setCombinedData([]);
        setShuffledProfiles([]);
      }
      setLoadingProfiles(false);
    };

    combineData();
  }, []);

  const shuffleProfiles = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleSearch = ({ value, criteria }) => {
    const normalizeString = (str) =>
      str
        .toLowerCase()
        .replace(/\s*,\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const normalizedValue = normalizeString(value);

    const filteredResults = combinedData.filter((user) => {
      if (criteria === 'name') {
        return normalizeString(user.name).includes(normalizedValue);
      } else if (criteria === 'location') {
        return normalizeString(user.location).includes(normalizedValue);
      } else if (criteria === 'skill') {
        return user.skills.some((skill) => normalizeString(skill).includes(normalizedValue));
      }
      return false;
    });

    setProfiles(filteredResults);
    setSearching(true);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil((searching ? profiles.length : combinedData.length) / recordsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    profilesRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  const handleSkillMatch = (results) => {
    setMatchedProfiles(results);
    setSearching(true);
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    const data = searching ? (matchedProfiles.length > 0 ? matchedProfiles : profiles) : shuffledProfiles;
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const renderProfiles = () => {
    if (loadingProfiles) {
      return (
        <>
          {Array(5)
            .fill('profile-skeleton')
            .map((item, index) => (
              <ProfileSkeleton key={index} />
            ))}
        </>
      );
    }
    const paginatedData = getPaginatedData();
    return paginatedData.map((currentRecord, index) => <Profile data={currentRecord} key={index} />);
  };

  return currentUrl === '/' ? (
    <div className="App flex flex-col bg-primaryColor dark:bg-secondaryColor md:flex-row">
      <Sidebar />
      <div className="w-full pl-5 pr-4 md:h-screen md:w-[77%] md:overflow-y-scroll md:py-7" ref={profilesRef}>
        <Search onSearch={handleSearch} />
        <SkillMatcher profiles={combinedData} onMatchResults={handleSkillMatch} />
        {(matchedProfiles.length === 0 && searching) || (profiles.length === 0 && searching) ? (
          <NoResultFound />
        ) : (
          renderProfiles()
        )}
        {combinedData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(
              (searching
                ? matchedProfiles.length > 0
                  ? matchedProfiles.length
                  : profiles.length
                : shuffledProfiles.length) / recordsPerPage,
            )}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        )}
      </div>
    </div>
  ) : (
    <ErrorPage />
  );
}

export default App;
