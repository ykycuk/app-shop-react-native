import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = (iconSize: number | null) =>
  EStyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    iconWrapper: {
      paddingTop: 3,
      paddingRight: 3,
      paddingBottom: 3,
    },
    icon: {
      tintColor: '#FFC107',
      width: iconSize,
      height: iconSize,
    },
  });

interface StarsRatingProps {
  size: number;
  value: number;
  isDisabled: boolean;
  count: number;
  onFinishRating?: Function;
  containerStyle?: object;
}

export const StarsRating: React.FC<StarsRatingProps> = ({
  size,
  value,
  isDisabled,
  count,
  onFinishRating,
  containerStyle,
}) => {
  const [stars, setStars] = useState([{ isActive: true }]);

  const ratingHandler = useCallback(
    (index: number) => {
      const newValue = [];
      for (let i = 0; i < count; i++) {
        const starObject = { isActive: i < index };
        newValue.push(starObject);
      }
      setStars(newValue);
      if (onFinishRating) {
        return onFinishRating(index);
      }
    },
    [count, onFinishRating],
  );

  useEffect(() => {
    ratingHandler(Math.floor(value));
  }, [ratingHandler, value]);

  const renderStar = (star: { isActive: boolean }, index: number) => {
    const path = star.isActive
      ? require('../assets/filled_star.png')
      : require('../assets/unfilled_star.png');

    return (
      <TouchableOpacity
        style={styles(null).iconWrapper}
        key={index}
        onPress={isDisabled ? undefined : () => ratingHandler(index)}
        activeOpacity={isDisabled ? 1 : 0.2}>
        <Image style={styles(size).icon} source={path} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ ...styles(null).container, ...containerStyle }}>
      {stars.map((star, index) => {
        return renderStar(star, index + 1);
      })}
    </View>
  );
};

export default StarsRating;
