// Copyright 2020 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef V8_HEAP_HEAP_ALLOCATOR_H_
#define V8_HEAP_HEAP_ALLOCATOR_H_

#include "include/v8config.h"
#include "src/base/macros.h"
#include "src/common/globals.h"
#include "src/heap/allocation-result.h"

namespace v8 {
namespace internal {

class CodeLargeObjectSpace;
class ConcurrentAllocator;
class Heap;
class NewSpace;
class NewLargeObjectSpace;
class OldLargeObjectSpace;
class PagedSpace;
class ReadOnlySpace;
class Space;

// Allocator for the main thread. All exposed functions internally call the
// right bottleneck.
class V8_EXPORT_PRIVATE HeapAllocator final {
 public:
  explicit HeapAllocator(Heap*);

  void Setup();
  void SetReadOnlySpace(ReadOnlySpace*);

  // Supports all `AllocationType` types.
  //
  // Returns a failed result on an unsuccessful allocation attempt.
  V8_WARN_UNUSED_RESULT V8_INLINE AllocationResult
  AllocateRaw(int size_in_bytes, AllocationType allocation,
              AllocationOrigin origin = AllocationOrigin::kRuntime,
              AllocationAlignment alignment = kTaggedAligned);

  // Supports all `AllocationType` types. Use when type is statically known.
  //
  // Returns a failed result on an unsuccessful allocation attempt.
  template <AllocationType type>
  V8_WARN_UNUSED_RESULT V8_INLINE AllocationResult AllocateRaw(
      int size_in_bytes, AllocationOrigin origin = AllocationOrigin::kRuntime,
      AllocationAlignment alignment = kTaggedAligned);

  // Supports only `AllocationType::kYoung` and `AllocationType::kOld`.
  //
  // Returns a failed result on an unsuccessful allocation attempt.
  V8_WARN_UNUSED_RESULT V8_INLINE AllocationResult
  AllocateRawData(int size_in_bytes, AllocationType allocation,
                  AllocationOrigin origin = AllocationOrigin::kRuntime,
                  AllocationAlignment alignment = kTaggedAligned);

  enum AllocationRetryMode { kLightRetry, kRetryOrFail };

  // Supports all `AllocationType` types and allows specifying retry handling.
  template <AllocationRetryMode mode>
  V8_WARN_UNUSED_RESULT V8_INLINE HeapObject
  AllocateRawWith(int size, AllocationType allocation,
                  AllocationOrigin origin = AllocationOrigin::kRuntime,
                  AllocationAlignment alignment = kTaggedAligned);

  V8_INLINE bool CanAllocateInReadOnlySpace() const;

#ifdef V8_ENABLE_ALLOCATION_TIMEOUT
  void UpdateAllocationTimeout();
  void SetAllocationTimeout(int allocation_timeout);
#endif  // V8_ENABLE_ALLOCATION_TIMEOUT

 private:
  V8_INLINE PagedSpace* code_space() const;
  V8_INLINE CodeLargeObjectSpace* code_lo_space() const;
  V8_INLINE PagedSpace* space_for_maps() const;
  V8_INLINE NewSpace* new_space() const;
  V8_INLINE NewLargeObjectSpace* new_lo_space() const;
  V8_INLINE OldLargeObjectSpace* lo_space() const;
  V8_INLINE PagedSpace* old_space() const;
  V8_INLINE ReadOnlySpace* read_only_space() const;

  V8_WARN_UNUSED_RESULT AllocationResult AllocateRawLargeInternal(
      int size_in_bytes, AllocationType allocation, AllocationOrigin origin,
      AllocationAlignment alignment);

  V8_WARN_UNUSED_RESULT AllocationResult AllocateRawWithRetryOrFailSlowPath(
      int size, AllocationType allocation, AllocationOrigin origin,
      AllocationAlignment alignment);

  V8_WARN_UNUSED_RESULT AllocationResult AllocateRawWithLightRetrySlowPath(
      int size, AllocationType allocation, AllocationOrigin origin,
      AllocationAlignment alignment);

#ifdef DEBUG
  void IncrementObjectCounters();
#endif  // DEBUG

  Heap* const heap_;
  Space* spaces_[LAST_SPACE + 1];
  PagedSpace* space_for_maps_;
  ReadOnlySpace* read_only_space_;

  ConcurrentAllocator* shared_old_allocator_;
  ConcurrentAllocator* shared_map_allocator_;

#ifdef V8_ENABLE_ALLOCATION_TIMEOUT
  // If the --gc-interval flag is set to a positive value, this variable
  // holds the value indicating the number of allocations remain until the
  // next failure and garbage collection.
  int allocation_timeout_ = 0;
#endif  // V8_ENABLE_ALLOCATION_TIMEOUT
};

}  // namespace internal
}  // namespace v8

#endif  // V8_HEAP_HEAP_ALLOCATOR_H_
