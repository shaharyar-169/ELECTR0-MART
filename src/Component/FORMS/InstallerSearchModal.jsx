import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { useTheme } from "../../ThemeContext";
import { getOrganisationData } from "../../Component/Auth";

const InstallerSearchModal = ({ isOpen, onClose, onSelectInstaller, apiLinks }) => {
  const {
    getcolor,
    fontcolor,
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchResults", searchResults)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const [organisation, setOrganisation] = useState(null);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Highlighted row index state
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const tableContainerRef = useRef(null);
  const rowRefs = useRef([]);

  // Get organisation data
  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
  }, []);

  // Focus search input when modal opens AND clear previous results
  useEffect(() => {
    if (isOpen) {
      // Clear previous search results when modal opens
      setSearchResults([]);
      setError(null);
      setSearchTerm("");
      // Reset sorting when modal opens
      setSortConfig({ key: null, direction: 'asc' });
      // Reset highlighted index
      setHighlightedIndex(-1);
      
      // Focus the search input
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle Enter key in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  // Handle search input change - update search term and keep focus
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Perform search API call
  const performSearch = async () => {
    if (!organisation) {
      setError("Organisation data not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = apiLinks + "/GetInstallars.php";
      const formData = new URLSearchParams({
        code: organisation.code,
      }).toString();

      console.log("Searching installars...");

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setSearchResults(response.data);
        if (response.data.length === 0) {
          setError("No installers found");
        } else {
          setError(null);
          // Highlight first row when data loads
          setHighlightedIndex(0);
        }
      } else {
        setSearchResults([]);
        setError("No installers found");
        setHighlightedIndex(-1);
      }
    } catch (error) {
      console.error("Error searching installers:", error);
      setError("Error searching installers");
      setSearchResults([]);
      setHighlightedIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle direction if same key
        return {
          key: key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // New key, default to ascending
        return {
          key: key,
          direction: 'asc'
        };
      }
    });
  };

  // Filter and sort search results
  const filteredAndSortedResults = useMemo(() => {
    // First filter
    let filtered = searchResults;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = searchResults.filter((installer) => {
        const code = (installer.tintcod || "").toLowerCase();
        const description = (installer.tintdsc || "").toLowerCase();
        return code.includes(term) || description.includes(term);
      });
    }

    // Then sort
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";
        
        // Handle numeric sorting for code
        if (sortConfig.key === 'tintcod') {
          const aNum = parseInt(aValue, 10);
          const bNum = parseInt(bValue, 10);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
          }
        }
        
        // String sorting
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchResults, searchTerm, sortConfig]);

  // Handle keyboard navigation for table
  const handleTableKeyDown = (e) => {
    const dataRows = filteredAndSortedResults;
    if (dataRows.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const newIndex = Math.min(highlightedIndex + 1, dataRows.length - 1);
      setHighlightedIndex(newIndex);
      scrollToRow(newIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      const newIndex = Math.max(highlightedIndex - 1, 0);
      setHighlightedIndex(newIndex);
      scrollToRow(newIndex);
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < dataRows.length) {
      e.preventDefault();
      e.stopPropagation();
      const installer = dataRows[highlightedIndex];
      if (installer.tintcod && installer.tintdsc) {
        onSelectInstaller({
          code: installer.tintcod,
          description: installer.tintdsc.trim()
        });
        onClose();
      }
    }
  };

  // Handle global keyboard events for search input
  const handleGlobalKeyDown = (e) => {
    // Only handle if modal is open
    if (!isOpen) return;
    
    // Check if search input is focused
    const isSearchFocused = document.activeElement === searchInputRef.current;
    
    // If search is focused, handle arrow keys for table navigation
    if (isSearchFocused && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const dataRows = filteredAndSortedResults;
      if (dataRows.length === 0) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      if (e.key === 'ArrowDown') {
        const newIndex = Math.min(highlightedIndex + 1, dataRows.length - 1);
        setHighlightedIndex(newIndex);
        scrollToRow(newIndex);
      } else if (e.key === 'ArrowUp') {
        const newIndex = Math.max(highlightedIndex - 1, 0);
        setHighlightedIndex(newIndex);
        scrollToRow(newIndex);
      }
    }
    
    // Handle Enter key for row selection when search is focused
    if (isSearchFocused && e.key === 'Enter' && highlightedIndex >= 0) {
      const dataRows = filteredAndSortedResults;
      if (dataRows.length > 0 && highlightedIndex < dataRows.length) {
        const installer = dataRows[highlightedIndex];
        if (installer.tintcod && installer.tintdsc) {
          e.preventDefault();
          e.stopPropagation();
          onSelectInstaller({
            code: installer.tintcod,
            description: installer.tintdsc.trim()
          });
          onClose();
        }
      }
    }
  };

  // Scroll to a specific row with conditional scrolling
  const scrollToRow = (index) => {
    if (!tableContainerRef.current || !rowRefs.current[index]) return;

    const container = tableContainerRef.current;
    const row = rowRefs.current[index];
    
    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    
    // Check if row is above the visible area
    if (rowRect.top < containerRect.top) {
      // Scroll up just enough to show the row
      container.scrollTop -= (containerRect.top - rowRect.top);
    }
    // Check if row is below the visible area
    else if (rowRect.bottom > containerRect.bottom) {
      // Scroll down just enough to show the row
      container.scrollTop += (rowRect.bottom - containerRect.bottom);
    }
    // Row is already visible - no scroll needed
  };

  // Handle row selection (double-click)
  const handleRowDoubleClick = (installer) => {
    if (installer.tintcod && installer.tintdsc) {
      onSelectInstaller({
        code: installer.tintcod,
        description: installer.tintdsc.trim()
      });
      onClose();
    }
  };

  // Handle modal overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Add global keydown listener for search focus navigation
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [isOpen, filteredAndSortedResults, highlightedIndex]);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    const filtered = filteredAndSortedResults;
    if (filtered.length > 0 && highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length - 1);
    } else if (filtered.length === 0) {
      setHighlightedIndex(-1);
    } else if (highlightedIndex === -1 && filtered.length > 0) {
      setHighlightedIndex(0);
    }
  }, [filteredAndSortedResults]);

  if (!isOpen) return null;

  // Sort icon component - using fontcolor for icon color to match header text
  const SortIcon = ({ columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const isAscending = isActive && sortConfig.direction === 'asc';
    const isDescending = isActive && sortConfig.direction === 'desc';
    
    // Use fontcolor for icons to match header text
    const iconColor = fontcolor || '#444';
    
    return (
      <span style={{ 
        marginLeft: '6px', 
        fontSize: '10px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '0.8',
        verticalAlign: 'middle',
      }}>
        <span style={{ 
          display: 'block',
          color: isAscending ? iconColor : (isActive ? iconColor : iconColor),
          opacity: isAscending ? 1 : (isActive ? 0.7 : 0.3),
          fontWeight: isAscending ? '700' : '400',
          fontSize: isAscending ? '11px' : '9px',
          marginBottom: '1px',
        }}>
          ▲
        </span>
        <span style={{ 
          display: 'block',
          color: isDescending ? iconColor : (isActive ? iconColor : iconColor),
          opacity: isDescending ? 1 : (isActive ? 0.7 : 0.3),
          fontWeight: isDescending ? '700' : '400',
          fontSize: isDescending ? '11px' : '9px',
        }}>
          ▼
        </span>
      </span>
    );
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '50px',
        zIndex: 10000,
      }}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: getcolor || '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          width: '600px',
          maxWidth: '90%',
          maxHeight: '80%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header - Using form's theme colors */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '10px',
          borderBottom: `1px solid ${fontcolor || '#e0e0e0'}`,
        }}>
          <h2 style={{
            margin: 0,
            color: fontcolor || '#1a1a2e',
            fontSize: '18px',
            fontFamily: getfontstyle || 'Arial, sans-serif',
            fontWeight: '700',
            letterSpacing: '0.3px',
          }}>
            Select Installar
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              color: fontcolor || '#999',
              padding: '2px 6px',
              lineHeight: '1',
              borderRadius: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = fontcolor || '#333';
              e.currentTarget.style.backgroundColor = fontcolor ? `${fontcolor}20` : '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = fontcolor || '#999';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* Search Input with Icon (Button Removed) */}
        <div style={{ 
          marginBottom: '15px',
          position: 'relative',
          display: 'inline-block',
        }}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            style={{
              width: '200px',
              height: '24px',
              padding: '0 8px 0 28px',
              fontSize: getdatafontsize || '14px',
              fontFamily: getfontstyle || 'Arial, sans-serif',
              border: `1px solid ${fontcolor || '#ccc'}`,
              borderRadius: '4px',
              backgroundColor: getcolor || '#ffffff',
              color: fontcolor || '#333',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {/* Search Icon */}
          <svg
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fill: fontcolor || '#999',
              opacity: 0.6,
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            fontSize: getdatafontsize || '14px',
          }}>
            {error}
          </div>
        )}

        {/* Results Table */}
        <div 
          ref={tableContainerRef}
          tabIndex={0}
          onKeyDown={handleTableKeyDown}
          style={{
            flex: 1,
            overflow: 'auto',
            border: `1px solid ${fontcolor || '#ddd'}`,
            borderRadius: '4px',
            height: '480px',
            scrollbarWidth: 'thin',
            scrollbarColor: `${fontcolor || '#ccc'} transparent`,
            outline: 'none',
          }}
        >
          {/* Custom scrollbar styles */}
          <style>
            {`
              .table-scroll-container::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }
              .table-scroll-container::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 10px;
              }
              .table-scroll-container::-webkit-scrollbar-thumb {
                background: ${fontcolor || '#ccc'}80;
                border-radius: 10px;
              }
              .table-scroll-container::-webkit-scrollbar-thumb:hover {
                background: ${fontcolor || '#999'};
              }
              .table-scroll-container:focus {
                outline: none;
              }
            `}
          </style>
          <div 
            className="table-scroll-container"
            style={{
              height: '100%',
              overflow: 'auto',
            }}
          >
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: getdatafontsize || '14px',
              fontFamily: getfontstyle || 'Arial, sans-serif',
            }}>
              <thead style={{
                backgroundColor: getcolor === '#ffffff' ? '#f0f2f5' : getcolor,
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}>
                <tr>
                  <th 
                    style={{
                      padding: '1px 10px',
                      textAlign: 'center',
                      borderBottom: `1px solid ${fontcolor || '#ddd'}`,
                      color: fontcolor || '#444',
                      fontWeight: '600',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      width: '135px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                      height: '20px',
                      lineHeight: '20px',
                    }}
                    onClick={() => handleSort('tintcod')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = fontcolor ? `${fontcolor}15` : '#e8eaed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = getcolor === '#ffffff' ? '#f0f2f5' : getcolor;
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Code <SortIcon columnKey="tintcod" />
                    </span>
                  </th>
                  <th 
                    style={{
                      padding: '1px 10px',
                      textAlign: 'center',
                      borderBottom: `1px solid ${fontcolor || '#ddd'}`,
                      color: fontcolor || '#444',
                      fontWeight: '600',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      width: '360px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                      height: '20px',
                      lineHeight: '20px',
                    }}
                    onClick={() => handleSort('tintdsc')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = fontcolor ? `${fontcolor}15` : '#e8eaed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = getcolor === '#ffffff' ? '#f0f2f5' : getcolor;
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Description <SortIcon columnKey="tintdsc" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const totalRows = 20;
                  const dataRows = filteredAndSortedResults.length > 0 ? filteredAndSortedResults : [];
                  const emptyCount = Math.max(0, totalRows - dataRows.length);
                  return (
                    <>
                      {dataRows.map((installer, index) => (
                        <tr
                          key={installer.id || index}
                          ref={(el) => (rowRefs.current[index] = el)}
                          onDoubleClick={() => handleRowDoubleClick(installer)}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: index === highlightedIndex
                              ? '#e3f2fd'
                              : index % 2 === 0 
                                ? (getcolor === '#ffffff' ? '#f9f9f9' : getcolor) 
                                : getcolor || '#ffffff',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (index !== highlightedIndex) {
                              e.currentTarget.style.backgroundColor = '#e3f2fd';
                              const cells = e.currentTarget.querySelectorAll('td');
                              cells.forEach(cell => {
                                cell.style.color = '#000000';
                              });
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (index !== highlightedIndex) {
                              const cells = e.currentTarget.querySelectorAll('td');
                              cells.forEach(cell => {
                                cell.style.color = fontcolor || '#333';
                              });
                              e.currentTarget.style.backgroundColor = index % 2 === 0 
                                ? (getcolor === '#ffffff' ? '#f9f9f9' : getcolor) 
                                : getcolor || '#ffffff';
                            }
                          }}
                        >
                          <td style={{
                            padding: '1px 10px',
                            borderBottom: `1px solid ${fontcolor || '#eee'}`,
                            color: index === highlightedIndex ? '#000000' : (fontcolor || '#333'),
                            width: '135px',
                            height: '20px',
                          }}>
                            {installer.tintcod || ''}
                          </td>
                          <td style={{
                            padding: '1px 10px',
                            borderBottom: `1px solid ${fontcolor || '#eee'}`,
                            color: index === highlightedIndex ? '#000000' : (fontcolor || '#333'),
                            width: '360px',
                            height: '20px',
                            textAlign: 'left',
                          }}>
                            {installer.tintdsc ? installer.tintdsc.trim() : ''}
                          </td>
                        </tr>
                      ))}
                      {Array.from({ length: emptyCount }).map((_, index) => (
                        <tr
                          key={`empty-${index}`}
                          ref={(el) => (rowRefs.current[dataRows.length + index] = el)}
                          style={{
                            backgroundColor: (dataRows.length + index) % 2 === 0 
                              ? (getcolor === '#ffffff' ? '#f9f9f9' : getcolor) 
                              : getcolor || '#ffffff',
                          }}
                          onMouseEnter={(e) => {
                            const cells = e.currentTarget.querySelectorAll('td');
                            cells.forEach(cell => {
                              cell.style.color = '#000000';
                            });
                          }}
                          onMouseLeave={(e) => {
                            const cells = e.currentTarget.querySelectorAll('td');
                            cells.forEach(cell => {
                              cell.style.color = fontcolor || '#333';
                            });
                          }}
                        >
                          <td style={{
                            padding: '1px 10px',
                            borderBottom: `1px solid ${fontcolor || '#eee'}`,
                            color: fontcolor || '#333',
                            width: '135px',
                            height: '20px',
                          }}>
                            &nbsp;
                          </td>
                          <td style={{
                            padding: '1px 10px',
                            borderBottom: `1px solid ${fontcolor || '#eee'}`,
                            color: fontcolor || '#333',
                            width: '360px',
                            height: '20px',
                            textAlign: 'left',
                          }}>
                            &nbsp;
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallerSearchModal;