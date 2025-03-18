import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';
import StarRating from 'react-native-star-rating-widget'; // Import StarRating
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { ScrollView } from 'react-native';

const API_URL = 'http://192.168.0.251:8082'; // Directly set the API endpoint

export default function Feedback() {
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

  // Function to submit feedback
  const handleFeedbackSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/feedback`, { rating, comment });
      if (response.status === 201) {
        alert('Feedback submitted successfully');
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
      const response = await axios.get(`${API_URL}/feedback`);
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
      setFilteredFeedbacks(allFeedbacks);
    } else {
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
        <ThemedText type="title" style={styles.title}>Rate Us</ThemedText>

        {/* Star Rating Input */}
        <View style={styles.ratingContainer}>
          <StarRating
            rating={rating}
            onChange={setRating}
            starSize={60} // Bigger stars
            color="#FFD700"
            emptyColor="#CCCCCC"
            enableHalfStar={false}
            starStyle={{ marginHorizontal: 5 }}
          />
        </View>

        {/* Comment Input */}
        <TextInput
          style={styles.input}
          placeholder="Comment"
          placeholderTextColor="#CCCCCC"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.feedbackTitle}>Feedback List</ThemedText>

        {/* Dropdown for Star Filtering */}
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
            onChange={(item) => setSelectedStar(item.value)}
          />
        </View>

        {/* Pagination Control */}
        <View style={styles.pageSelectionContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.paginationContentContainer}
          >
            {pageNumbers.map((pageNumber) => (
              <TouchableOpacity
                key={pageNumber}
                style={[
                  styles.pageNumberButton,
                  pageNumber === currentPage && styles.activePageNumberButton,
                ]}
                onPress={() => handlePageChange(pageNumber)}
              >
                <ThemedText style={styles.pageNumberText}>{pageNumber}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feedback List */}
        {loading ? (
          <ActivityIndicator size="large" color="#3333FF" />
        ) : (
          <FlatList
            data={paginatedFeedback()}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.feedbackItem}>
                <View style={styles.feedbackHeader}>
                  {/* Display Name */}
                  <ThemedText style={styles.feedbackName}>{item.name}</ThemedText>
                  <StarRating
                    rating={item.rating}
                    onChange={() => {}}
                    starSize={20}
                    color="#FFD700"
                    emptyColor="#CCCCCC"
                    enableHalfStar={false}
                    starStyle={{ marginHorizontal: 2 }}
                  />
                </View>
                <ThemedText style={styles.feedbackComment}>"{item.comment}"</ThemedText>
              </View>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

// Updated Styles
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
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
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
    backgroundColor: '#FFD700', // Highlight active page
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
    borderRadius: 25,
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
