import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import StarRating from 'react-native-star-rating-widget'; // Import StarRating
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import config from '../config'; // Import the configuration file

const { width } = Dimensions.get('window');

export default function Feedback() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [allFeedbacks, setAllFeedbacks] = useState([]); // Store all feedback
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]); // Store filtered feedback
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const pageSize = 2; // Number of feedback items per page
  const [loading, setLoading] = useState(false);
  // Dropdown state
  const [selectedStar, setSelectedStar] = useState(null); // Selected star rating for filtering
  const starOptions = [
    { label: 'All', value: null },
    { label: '⭐ 1 Star', value: 1 },
    { label: '⭐ 2 Stars', value: 2 },
    { label: '⭐ 3 Stars', value: 3 },
    { label: '⭐ 4 Stars', value: 4 },
    { label: '⭐ 5 Stars', value: 5 },
  ];

  // Function to attempt API requests with fallback IPs
  const attemptRequestWithFallback = async (endpoint, requestData = {}, method = 'POST') => {
    for (const ip of config.ipList) {
      const apiUrl = `http://${ip}/${endpoint}`;
      try {
        console.log(`Attempting request with IP: ${ip}`);
        const response = await axios({
          method,
          url: apiUrl,
          data: requestData,
          timeout: 500, // Timeout after 0.5 seconds
        });

        if (response.status >= 200 && response.status < 300) {
          return response; // Return the successful response
        }
      } catch (error) {
        console.warn(`IP ${ip} failed: ${error.message || error}`);
      }
    }
    throw new Error('No reachable backend server found');
  };

  // Function to submit feedback
  const handleFeedbackSubmit = async () => {
    try {
      const result = await attemptRequestWithFallback('feedback', { name, rating, comment });
      if (result.status === 201) {
        alert('Feedback submitted successfully');
        setName('');
        setRating(0);
        setComment('');
        fetchFeedback(); // Refresh feedback list after submission
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback');
    }
  };

  // Function to fetch all feedback
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await attemptRequestWithFallback('feedback', null, 'GET'); // Use fallback logic
      setAllFeedbacks(response.data); // Store all feedback
      setFilteredFeedbacks(response.data); // Initialize filtered feedback with all feedback
    } catch (err) {
      console.error(err);
      alert('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback when the component mounts
  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle star filter selection
  useEffect(() => {
    if (selectedStar === null) {
      // Reset filter to show all feedback
      setFilteredFeedbacks(allFeedbacks);
    } else {
      // Filter feedback by selected star rating
      const filtered = allFeedbacks.filter((item) => item.rating === selectedStar);
      setFilteredFeedbacks(filtered);
    }
    setCurrentPage(1); // Reset to the first page when filtering
  }, [selectedStar]);

  // Get paginated feedback for the current page
  const paginatedFeedback = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredFeedbacks.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredFeedbacks.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  // Generate page numbers
  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <LinearGradient colors={['#05002E', '#191540']} style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Submit Feedback</ThemedText>
        {/* Input fields */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#CCCCCC"
          value={name}
          onChangeText={setName}
        />
        {/* Star Rating Input */}
        <View style={styles.ratingContainer}>
          <ThemedText style={styles.ratingLabel}>Rate Us:</ThemedText>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={24} // Smaller star size for compact design
            color="#FFD700" // Gold color for filled stars
            emptyColor="#CCCCCC" // Gray color for empty stars
            enableHalfStar={false} // Disable half-star ratings
            starStyle={{ marginHorizontal: 2 }} // Tight spacing between stars
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Comment"
          placeholderTextColor="#CCCCCC"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        </TouchableOpacity>
        {/* Display fetched feedback */}
        <ThemedText type="title" style={styles.feedbackTitle}>Feedback List</ThemedText>
        {/* Single-Select Dropdown for Star Filtering */}
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={starOptions}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Filter by Stars"
            value={selectedStar}
            onChange={(item) => {
              setSelectedStar(item.value); // Update selected star
            }}
            renderLeftIcon={() => (
              <StarRating
                rating={selectedStar || 0}
                onChange={() => {}}
                starSize={16} // Compact star size for dropdown
                color="#FFD700"
                emptyColor="#CCCCCC"
                enableHalfStar={false}
                starStyle={{ marginHorizontal: 2 }}
              />
            )}
          />
        </View>
        {/* Page Selection Controls (Moved to Top) */}
        <View style={styles.pageSelectionContainer}>
          {pageNumbers.map((pageNumber) => (
            <TouchableOpacity
              key={pageNumber}
              style={[
                styles.pageNumberButton,
                pageNumber === currentPage && styles.activePageNumberButton,
              ]}
              onPress={() => handlePageChange(pageNumber)}
            >
              <ThemedText style={styles.pageNumberText}>
                {pageNumber}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#3333FF" />
        ) : (
          <FlatList
            data={paginatedFeedback()}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.feedbackItem}>
                {/* User Name and Star Rating */}
                <View style={styles.feedbackHeader}>
                  <ThemedText style={styles.feedbackName}>{item.name}</ThemedText>
                  <StarRating
                    rating={item.rating}
                    onChange={() => {}} // Make it readonly by providing an empty function
                    starSize={16} // Compact star size
                    color="#FFD700" // Gold color for filled stars
                    emptyColor="#CCCCCC" // Gray color for empty stars
                    enableHalfStar={false} // Disable half-star ratings
                    starStyle={{ marginHorizontal: 2 }} // Tight spacing between stars
                  />
                </View>
                {/* Comment */}
                <ThemedText style={styles.feedbackComment}>"{item.comment}"</ThemedText>
              </View>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

// Styles remain unchanged...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0F1238',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3333FF',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 10,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3333FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  feedbackItem: {
    backgroundColor: '#1A1A40',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  feedbackComment: {
    fontSize: 14,
    color: '#DDDDDD',
    fontStyle: 'italic',
  },
  pageSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  pageNumberButton: {
    backgroundColor: '#3333FF',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activePageNumberButton: {
    backgroundColor: '#FFD700', // Highlight the active page
  },
  pageNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    height: 45,
    backgroundColor: '#3333FF',
    borderRadius: 25, // Rounded corners for Shopee-like design
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});