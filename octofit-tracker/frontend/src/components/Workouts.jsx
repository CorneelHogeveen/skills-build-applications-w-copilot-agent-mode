import CollectionView from './CollectionView';

export default function Workouts() {
  return (
    <CollectionView
      title="Workouts"
      resourcePath="workouts"
      emptyLabel="Nog geen workout-suggesties gevonden."
    />
  );
}
