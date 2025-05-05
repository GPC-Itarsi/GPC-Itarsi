// This is a test script to check if the student addition functionality is working correctly
const axios = require('axios');

const config = {
  apiUrl: 'http://localhost:5001'
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTZkYjVlOGE2MzcyY2M5ZjU3MGU4ZSIsInVzZXJuYW1lIjoib3BlcmF0b3IiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiT3BlcmF0b3IgQWRtaW4iLCJpYXQiOjE3NDYzNTk3OTQsImV4cCI6MTc0NjQ0NjE5NH0.Dze5ZEtbrcILY8IQrDnNmNo2Rt8HKCJMoO5K45PAxmE';

// Function to add a student
async function addStudent() {
  try {
    const formData = {
      name: 'Test Student ' + Math.floor(Math.random() * 1000),
      rollNumber: 'TEST' + Math.floor(Math.random() * 10000),
      className: 'CS 1',
      password: '1234',
      branch: 'CS'
    };

    console.log('Sending request to add student:', formData);

    const response = await axios.post(
      `${config.apiUrl}/api/admin/add-student`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Add student response:', response.data);

    // Now fetch the students to verify the student was added
    const studentsResponse = await axios.get(
      `${config.apiUrl}/api/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Students count:', studentsResponse.data.length);
    
    // Check if the newly added student is in the list
    const newStudent = studentsResponse.data.find(student => student.rollNumber === formData.rollNumber);
    if (newStudent) {
      console.log('Student was added successfully:', newStudent);
    } else {
      console.log('Student was not found in the list!');
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.message || error.message);
  }
}

// Run the test
addStudent();
