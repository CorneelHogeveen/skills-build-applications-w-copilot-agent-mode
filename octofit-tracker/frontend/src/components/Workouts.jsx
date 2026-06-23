import CollectionView from './CollectionView';

export default function Workouts() {
  return (
    <CollectionView
      title="Workouts"
      endpointPath="/api/workouts/"
      emptyLabel="Nog geen workout-suggesties gevonden."
    />
  );
}
