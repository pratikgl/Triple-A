import * as React from 'react';

const Alert = React.forwardRef(({ className = '', variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-100 dark:border-gray-700 shadow-md shadow-gray-200/50',
    destructive: 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-50 border-red-200 dark:border-red-800 shadow-md shadow-red-200/50',
    success: 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-50 border-green-200 dark:border-green-800 shadow-md shadow-green-200/50',
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-xl border-2 px-5 py-4 text-sm transition-all duration-300 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
});
Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };

