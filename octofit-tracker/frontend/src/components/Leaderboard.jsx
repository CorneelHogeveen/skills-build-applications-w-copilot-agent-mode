import CollectionView from './CollectionView';

export default function Leaderboard() {
  return (
    <CollectionView
      title="Leaderboard"
      resourcePath="leaderboard"
      emptyLabel="Nog geen leaderboard-data gevonden."
    />
  );
}
