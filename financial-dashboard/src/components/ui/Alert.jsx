import * as React from 'react';

const Alert = React.forwardRef(({ className = '', variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700',
    destructive: 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-50 border-red-200 dark:border-red-800',
    success: 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-50 border-green-200 dark:border-green-800',
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]} ${className}`}
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

