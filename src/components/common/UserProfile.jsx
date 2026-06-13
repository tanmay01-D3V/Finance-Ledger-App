const UserProfile = () => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      <div className="text-right">
        <h3 className="font-semibold">
          Alex Sterling
        </h3>

        <p className="text-sm text-gray-500">
          Admin
        </p>
      </div>

      <img
        src="https://i.pravatar.cc/100"
        alt="user"
        className="
          w-10
          h-10
          rounded-full
        "
      />
    </div>
  );
};

export default UserProfile;