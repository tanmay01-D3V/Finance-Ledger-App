import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";
import UserProfile from "./UserProfile";
import PrimaryButton from "./PrimaryButton";

const Header = () => {
  return (
    <header
      className="
        bg-white
        border-b
        px-8
        py-4
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <SearchBar
          placeholder="Search transactions..."
        />

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <NotificationButton />

          <PrimaryButton>
            + Add Transaction
          </PrimaryButton>

          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;