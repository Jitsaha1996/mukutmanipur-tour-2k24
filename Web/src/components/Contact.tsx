import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const Contact = () => {
  const userData = useSelector((state: RootState) => state.user.userData);
  return (
    <div>
            {userData ? (
                <p>Welcome, {userData.rName}!</p>
            ) : (
                <p>Please register or log in.</p>
            )}
        </div>
  )
}
