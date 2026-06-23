import CollectionView from './CollectionView';

export default function Leaderboard() {
  return (
    <CollectionView
      title="Leaderboard"
      endpointPath="/api/leaderboard/"
      emptyLabel="Nog geen leaderboard-data gevonden."
    />
  );
}
