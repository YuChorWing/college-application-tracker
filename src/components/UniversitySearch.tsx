import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, BookOpen, BarChart2, X,
  Filter, ChevronDown, Check, SlidersHorizontal
} from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { University } from '@/types';
import Button from './Button';
import Checkbox from './Checkbox';
import Slider from './Slider';
import Dropdown from './Dropdown';
import Modal from './Modal';

const UniversitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    countries: [] as string[],
    states: [] as string[],
    majors: [] as string[],
    minAcceptance: 0,
    maxAcceptance: 100,
    minRanking: 1,
    maxRanking: 200,
    applicationSystems: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取筛选选项数据
  const { data: filterOptions } = useSWR('/api/universities/filters', fetcher);

  // 搜索大学
  const searchUniversities = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      selectedFilters.countries.forEach(c => params.append('country', c));
      selectedFilters.states.forEach(s => params.append('state', s));
      selectedFilters.majors.forEach(m => params.append('major', m));
      params.append('minAcceptance', selectedFilters.minAcceptance.toString());
      params.append('maxAcceptance', selectedFilters.maxAcceptance.toString());
      params.append('minRanking', selectedFilters.minRanking.toString());
      params.append('maxRanking', selectedFilters.maxRanking.toString());
      selectedFilters.applicationSystems.forEach(a => params.append('system', a));

      const response = await fetch(`/api/universities?${params.toString()}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选变化时搜索
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUniversities();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedFilters]);

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchUniversities();
  };

  // 更新筛选条件
  const updateFilter = (key: string, value: any) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  // 切换国家筛选
  const toggleCountry = (country: string) => {
    setSelectedFilters(prev => {
      const countries = prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country];
      return { ...prev, countries };
    });
  };

  // 切换专业筛选
  const toggleMajor = (major: string) => {
    setSelectedFilters(prev => {
      const majors = prev.majors.includes(major)
        ? prev.majors.filter(m => m !== major)
        : [...prev.majors, major];
      return { ...prev, majors };
    });
  };

  // 切换申请系统筛选
  const toggleApplicationSystem = (system: string) => {
    setSelectedFilters(prev => {
      const applicationSystems = prev.applicationSystems.includes(system)
        ? prev.applicationSystems.filter(a => a !== system)
        : [...prev.applicationSystems, system];
      return { ...prev, applicationSystems };
    });
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    setSelectedFilters({
      countries: [],
      states: [],
      majors: [],
      minAcceptance: 0,
      maxAcceptance: 100,
      minRanking: 1,
      maxRanking: 200,
      applicationSystems: []
    });
    setSearchTerm('');
  };

  // 添加到申请列表
  const addToApplications = (university: University) => {
    console.log('Add application for:', university.name);
    // 实际实现中会打开申请创建模态框
  };

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities by name..."
              value={searchTerm}
              onChange={handleSearchInput}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="rounded-l-none"
            isLoading={loading}
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hidden md:flex items-center"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* 活跃筛选器标签 */}
        {(selectedFilters.countries.length > 0 ||
          selectedFilters.majors.length > 0 ||
          selectedFilters.applicationSystems.length > 0 ||
          selectedFilters.minAcceptance > 0 ||
          selectedFilters.maxAcceptance < 100 ||
          selectedFilters.minRanking > 1 ||
          selectedFilters.maxRanking < 200) && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-sm text-gray-600 self-center">Active filters:</span>

              {selectedFilters.countries.map(country => (
                <span key={`country-${country}`} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  {country}
                  <button
                    type="button"
                    onClick={() => toggleCountry(country)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {selectedFilters.majors.map(major => (
                <span key={`major-${major}`} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  {major}
                  <button
                    type="button"
                    onClick={() => toggleMajor(major)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
      </form>

      {/* 搜索结果 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {results.length} {results.length === 1 ? 'University' : 'Universities'} Found
          </h2>
          <Dropdown
            items={[
              { label: 'Ranking (High to Low)', value: 'ranking_asc' },
              { label: 'Ranking (Low to High)', value: 'ranking_desc' },
              { label: 'Acceptance Rate (High to Low)', value: 'acceptance_desc' },
              { label: 'Acceptance Rate (Low to High)', value: 'acceptance_asc' }
            ]}
            defaultValue="ranking_asc"
            onSelect={(value) => console.log('Sort by:', value)}
          >
            <Button variant="outline" size="sm" className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort By
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </Dropdown>
        </div>

        {loading ? (
          // 加载状态
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border overflow-hidden shadow-sm animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="flex justify-end">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          // 无结果状态
          <div className="bg-white rounded-lg border p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria to find more universities.
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          // 结果列表
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(university => (
              <div key={university.id} className="bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-100 relative">
                  {university.imageUrl && (
                    <img
                      src={university.imageUrl}
                      alt={university.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {university.usNewsRanking && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      # {university.usNewsRanking}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{university.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {university.city}, {university.state}, {university.country}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Acceptance Rate</span>
                      <span className="font-medium">{university.acceptanceRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Application System</span>
                      <span className="font-medium">{university.applicationSystem}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Application Fee</span>
                      <span className="font-medium">${university.applicationFee}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('View details', university.id)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToApplications(university)}
                    >
                      Add to Applications
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 筛选器模态框 */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Universities"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">
          {/* 国家筛选 */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Countries</h3>
            <div className="space-y-2">
              {filterOptions?.countries.map((country: any) => (
                <div key={country} className="flex items-center">
                  <Checkbox
                    id={`country-${country}`}
                    checked={selectedFilters.countries.includes(country)}
                    onChange={() => toggleCountry(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="ml-2 text-gray-700 text-sm cursor-pointer"
                  >
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 专业筛选 */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Majors Offered</h3>
            <div className="space-y-2">
              {filterOptions?.majors.slice(0, 10).map((major: any) => (
                <div key={major} className="flex items-center">
                  <Checkbox
                    id={`major-${major}`}
                    checked={selectedFilters.majors.includes(major)}
                    onChange={() => toggleMajor(major)}
                  />
                  <label
                    htmlFor={`major-${major}`}
                    className="ml-2 text-gray-700 text-sm cursor-pointer"
                  >
                    {major}
                  </label>
                </div>
              ))}
              {filterOptions?.majors.length > 10 && (
                <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                  Show {filterOptions.majors.length - 10} more majors
                </Button>
              )}
            </div>
          </div>

          {/* 申请系统筛选 */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Application Systems</h3>
            <div className="space-y-2">
              {['Common App', 'Coalition App', 'Direct Application'].map(system => (
                <div key={system} className="flex items-center">
                  <Checkbox
                    id={`system-${system}`}
                    checked={selectedFilters.applicationSystems.includes(system)}
                    onChange={() => toggleApplicationSystem(system)}
                  />
                  <label
                    htmlFor={`system-${system}`}
                    className="ml-2 text-gray-700 text-sm cursor-pointer"
                  >
                    {system}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 录取率筛选 */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Acceptance Rate: {selectedFilters.minAcceptance}% - {selectedFilters.maxAcceptance}%
            </h3>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[selectedFilters.minAcceptance, selectedFilters.maxAcceptance]}
              onValueChange={value => {
                if (Array.isArray(value)) {
                  updateFilter('minAcceptance', value[0]);
                  updateFilter('maxAcceptance', value[1]);
                }
              }}
            />
          </div>

          {/* 排名筛选 */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              US News Ranking: {selectedFilters.minRanking} - {selectedFilters.maxRanking}
            </h3>
            <Slider
              min={1}
              max={200}
              step={1}
              value={[selectedFilters.minRanking, selectedFilters.maxRanking]}
              onValueChange={value => {
                if (Array.isArray(value)) {
                  updateFilter('minRanking', value[0]);
                  updateFilter('maxRanking', value[1]);
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={clearFilters}>
            Reset Filters
          </Button>
          <Button variant="primary" onClick={() => {
            setShowFilters(false);
            searchUniversities();
          }}>
            Apply Filters
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UniversitySearch;