import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import picture from '../assets/icons8-steering-wheel-50.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FamilyMember, IUser } from '../common/user';
import { getFromLocalStorage } from '../redux/localStorage';
import { setUser } from '../redux/userSlice';

const BusLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #B2E0D4;
  overflow: hidden; // Prevent overflow
`;

const Side = styled.div`
  display: flex;
  flex-wrap: wrap; // Allow wrapping
  width: 40%; // Use percentage instead of vw
  padding: 10px;
  border: 2px solid black;
  box-sizing: border-box; // Ensure border is included in width
`;

const SeatRow = styled.div`
  display: flex;
  justify-content: space-between; // Space items evenly
  width: 100%; // Full width of the parent
  margin-bottom: 10px;
`;

const Seat = styled.div<{ selected: boolean }>`
  flex: 1; // Allow seats to grow and take available space
  height: 40px;
  background-color: #ccc;
  border: 1px solid #333;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${({ selected }) => (selected ? '#4caf50' : '#ccc')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  margin: 0 5px; // Add a small margin to create space between seats
`;

const LastRow = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  border: 2px solid black;
  width: 100%;
`;

const BusLayout: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData) as IUser | null;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSeatDetailsVisible, setIsSeatDeatilsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
    
      const storedUserData: IUser | null = getFromLocalStorage('userData');

      if (storedUserData) {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/email/${storedUserData.email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) throw new Error('Failed to fetch user data');
          const userData = await response.json();
          if (userData) {
            dispatch(setUser(userData));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();

  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    setIsSeatDeatilsVisible(!!userData?.familyMembers.every((item: FamilyMember) => item.seatNumber !== ""));
    const seatDeatils = !!userData?.familyMembers.every((item: FamilyMember) => item.seatNumber !== "") ?
      userData?.familyMembers?.map((item: FamilyMember) => item.seatNumber) : [];
    toggleSeatSelection(seatDeatils as string[]);

    setLoading(false);
  }, [userData]);

  const seats = {
    left: [
      ['1', '2'],
      ['6', '7'],
      ['11', '12'],
      ['16', '17'],
      ['21', '22'],
      ['26', '27'],
      ['31', '32'],
      ['36', '37'],
      ['41', '42'],
      ['46', '47'],
      ['51', '52']
    ],
    right: [
      ['3', '4', '5'],
      ['8', '9', '10'],
      ['13', '14', '15'],
      ['18', '19', '20'],
      ['23', '24', '25'],
      ['28', '29', '30'],
      ['33', '34', '35'],
      ['38', '39', '40'],
      ['43', '44', '45'],
      ['48', '49', '50'],
      ['53', '54', '55']
    ],
    lastRow: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
  };

  const toggleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats);
  };

  return (
    <>
      {isSeatDetailsVisible ? (
        <BusLayoutContainer>
          <Box display="flex" flexDirection="row" width="100%" height="10vh" paddingY="20px" sx={{ "border": "2px solid black" }}>
            <Box display="flex" width="60%" bgcolor="#FFEBB5" justifyContent="center" alignItems="center">
              <Typography display="flex" variant='h5' color='black'>
                Cabin
              </Typography>
            </Box>
            <Box display="flex" width="40%" bgcolor="#ADD8E6" justifyContent="center" alignItems="center">
              <Avatar
                alt="User Avatar"
                src={picture}
                style={{ width: '70px', height: '70px' }} // Adjust the size as needed
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <Side className="left-side">
              {seats.left.map((row, rowIndex) => (
                <SeatRow key={rowIndex}>
                  {row.map((seat) => (
                    <Seat
                      key={seat}
                      selected={selectedSeats.includes(seat)}

                    >
                      {seat}
                    </Seat>
                  ))}
                </SeatRow>
              ))}
            </Side>

            <Box display="flex" width="20vw" /> {/* Optional spacer */}

            <Side className="right-side">
              {seats.right.map((row, rowIndex) => (
                <SeatRow key={rowIndex}>
                  {row.map((seat) => (
                    <Seat
                      key={seat}
                      selected={selectedSeats.includes(seat)}

                    >
                      {seat}
                    </Seat>
                  ))}
                </SeatRow>
              ))}
            </Side>
          </Box>

          {/* Last row (optional) */}
          <Box display="flex" flexDirection="row" width="100%">
            <LastRow className="last-row">
              {seats.lastRow.map((seat) => (
                <Seat
                  key={seat}
                  selected={selectedSeats.includes(seat)}

                >
                  {seat}
                </Seat>
              ))}
            </LastRow>
          </Box>
        </BusLayoutContainer>
      ) : (
        <Typography variant='h1'>
          No Seat Details Yet!!
        </Typography>
      )}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default BusLayout;
