import styles from './SquareCard.module.scss';

interface ISquareCardProps {
  children: React.ReactElement;
}

// To use this component the container should have the width property mentioned
const SquareCard = ({ children }: ISquareCardProps) => {
  return (
    <div className={`rounded-3 w-100 h-100 position-relative ${styles.cardWrapper}`}>
      <div className={`${styles.childWrapper} position-absolute`}>
        {children}
      </div>
    </div>
  );
}

export default SquareCard;
