export const getEndOfWorkoutMessage = () => {
  return {
    header: "Workout Done!",
    text: "Great work today!\nPlease note that you can't start a new training session until tomorrow, so take a good rest.\n\nIn the meantime, feel free to check your progress on the Statistics page.\n\nKeep pushing forward!",
  };
};

export const getFirstLoginMessage = (fullName) => {
  const firstName = fullName.split(" ")[0];
  return {
    header: `Welcome to Strong Together, ${firstName}!`,
    text: "We're happy to have you with us. Your fitness journey begins now — let’s make it count!\n\nYou don’t have an active workout plan yet. To get started, go to the Home page and create one.\n\nYou can choose between 1 to 6 workout splits and add your favorite exercises to each.\n\nIf you have any questions, feel free to ask our AI trainer anytime.\n\nGood luck!\nThe Strong Together Team",
  };
};
