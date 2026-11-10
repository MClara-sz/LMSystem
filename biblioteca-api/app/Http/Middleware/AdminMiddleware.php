<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o utilizador está autenticado E se o role dele é 'admin'
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Se não for admin, bloqueia e retorna erro 403 (Acesso Proibido)
        return response()->json([
            'message' => 'Acesso não autorizado. Recurso restrito a administradores.'
        ], 403);
    }
}