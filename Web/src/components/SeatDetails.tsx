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
  overflow: hidden;
`;

const Side = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 40%;
  padding: 10px;
  border: 2px solid black;
  box-sizing: border-box;
`;

const SeatRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const Seat = styled.div<{ selected: string; hoverText: string }>`
  flex: 1;
  height: 40px;
  background-color: ${({ selected }) => {
    if (selected === 'self') return '#4caf50'; // Green for self
    if (selected === 'oc') return 'red'; // Red for occupied
    return '#ccc'; // Light gray for aoc
  }};
  border: 1px solid #333;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  color: ${({ selected }) => (selected === 'self' ? 'white' : selected === 'oc' ? 'blue' : 'black')};
  margin: 0 5px;
  position: relative; // Needed for the tooltip

  &:hover::after {
    content: "${({ hoverText }) => hoverText}";
    position: absolute;
    left: 50%;
    bottom: 100%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 5px;
    white-space: nowrap;
  }
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
  const [isSeatDetailsVisible, setIsSeatDetailsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);

  const seats = {
    left: [
      ['1', '2'],
      ['9', '10'],
      ['14', '15'],
      ['19', '20'],
      ['24', '25'],
      ['29', '30'],
      ['34', '35'],
      ['39', '40'],
      ['44', '45'],
      ['49', '50']
    ],
    right: [
      ['3', '4', '5'],
      ['6', '7', '8'],
      ['11', '12', '13'],
      ['16', '17', '18'],
      ['21', '22', '23'],
      ['26', '27', '28'],
      ['31', '32', '33'],
      ['36', '37', '38'],
      ['41', '42', '43'],
      ['46', '47', '48'],
      ['51', '52', '53'],
    ],
    lastRow: ['54', '55', '56', '57', '58', '59']
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
            const seatDetails = userData.familyMembers
              .filter((member: FamilyMember) => member.seatNumber)
              .map((member: FamilyMember) => member.seatNumber);
            setSelectedSeats(seatDetails as string[]);
            setIsSeatDetailsVisible(seatDetails.length > 0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [dispatch]);

  // Modify checkSeats function to return only string type
  const checkSeats = (seat: string): string => {
    // Check if the seat is selected by the user
    if (selectedSeats.includes(seat)) {
      return 'self';
    }

    // Check if the seat is occupied by a family member
    for (const user of users) {
      const member = user.familyMembers.find((member: FamilyMember) => member.seatNumber === seat);
      if (member) {
        return 'oc'; // Return 'oc' if occupied
      }
    }

    return 'aoc'; // Otherwise return 'aoc'
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
                style={{ width: '70px', height: '70px' }}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" width="100%">
            <Side className="left-side">
              {seats.left.map((row, rowIndex) => (
                <SeatRow key={rowIndex}>
                  {row.map((seat) => {
                    const seatStatus = checkSeats(seat);
                    const hoverText = seatStatus === 'self' ? users
                      .flatMap(user => user.familyMembers)
                      .find(member => member.seatNumber === seat)?.name || '' : users
                        .flatMap(user => user.familyMembers)
                        .find(member => member.seatNumber === seat)?.name || '';
                    return (
                      <Seat key={seat} selected={seatStatus} hoverText={hoverText}>
                        {seat}
                      </Seat>
                    );
                  })}
                </SeatRow>
              ))}
            </Side>

            <Box display="flex" width="20vw" />

            <Side className="right-side">
              {seats.right.map((row, rowIndex) => (
                <SeatRow key={rowIndex}>
                  {row.map((seat) => {
                    const seatStatus = checkSeats(seat);
                    const hoverText = seatStatus === 'self' ? users
                      .flatMap(user => user.familyMembers)
                      .find(member => member.seatNumber === seat)?.name || '' : users
                        .flatMap(user => user.familyMembers)
                        .find(member => member.seatNumber === seat)?.name || '';
                    return (
                      <Seat key={seat} selected={seatStatus} hoverText={hoverText}>
                        {seat}
                      </Seat>
                    );
                  })}
                </SeatRow>
              ))}
            </Side>
          </Box>

          <Box display="flex" flexDirection="row" width="100%">
            <LastRow className="last-row">
              {seats.lastRow.map((seat) => {
                const seatStatus = checkSeats(seat);
                const hoverText = seatStatus === 'self' ? users
                  .flatMap(user => user.familyMembers)
                  .find(member => member.seatNumber === seat)?.name || '' : users
                    .flatMap(user => user.familyMembers)
                    .find(member => member.seatNumber === seat)?.name || '';
                return (
                  <Seat key={seat} selected={seatStatus} hoverText={hoverText}>
                    {seat}
                  </Seat>
                );
              })}
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
