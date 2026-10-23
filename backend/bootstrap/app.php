<?php

use App\Exceptions\PrmAuth\PrmAuthException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(
            function (
                PrmAuthException $exception,
                Request $request
            ) {
                if (! $request->is('api/v1/auth/*')) {
                    return null;
                }

                return response()->json([
                    'status' => 'error',
                    'code' => $exception->authCode(),
                ], $exception->status());
            }
        );

        $exceptions->render(
            function (
                ValidationException $exception,
                Request $request
            ) {
                if (! $request->is('api/v1/auth/*')) {
                    return null;
                }

                return response()->json([
                    'status' => 'error',
                    'code' => 'prm_auth_invalid_request',
                ], 422);
            }
        );

        $exceptions->render(
            function (
                HttpExceptionInterface $exception,
                Request $request
            ) {
                if (! $request->is('api/v1/auth/*')) {
                    return null;
                }

                if ($exception->getStatusCode() === 429) {
                    return response()->json([
                        'status' => 'error',
                        'code' => 'prm_auth_too_many_requests',
                    ], 429);
                }

                return response()->json([
                    'status' => 'error',
                    'code' => 'prm_auth_request_failed',
                ], $exception->getStatusCode());
            }
        );

        $exceptions->render(
            function (
                Throwable $exception,
                Request $request
            ) {
                if (! $request->is('api/v1/auth/*')) {
                    return null;
                }

                report($exception);

                return response()->json([
                    'status' => 'error',
                    'code' => 'prm_auth_request_failed',
                ], 500);
            }
        );
    })
    ->create();
