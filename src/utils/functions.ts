type Character = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    character: {
        id: string;
        name: string;
    }
};

type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    hasUnread: boolean;
    user: {
        id: string;
        name: string;
    }
};

export const formatNames = (
  characters: Array<Character>,
  users: Array<User>,
  myUserId: string
): string => {
    const charnames = characters
        .map((c) => c.character.name);

    const usernames = users
        .filter((u) => u.user.id != myUserId)
        .map((u) => u.user.name);

    return [...charnames, ...usernames].join(", ");
};