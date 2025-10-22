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
    text: "We're excited to have you on board. Your fitness journey starts today — every step counts!\n\nYou don’t have a workout plan yet. Head over to the Home page and create one to get started.\n\nYou can build your own plan with 1 to 6 workout splits and customize each with the exercises you enjoy most.\n\nStay consistent, stay strong, and remember — progress is built one rep at a time.\n\nThe Strong Together Team",
  };
};
